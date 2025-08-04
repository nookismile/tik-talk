import {Component, ElementRef, inject, input, OnDestroy, OnInit, Renderer2, signal, computed} from '@angular/core';
import {ChatWorkspaceMessageComponent} from './chat-workspace-message/chat-workspace-message.component';
import {MessageInputComponent} from '../../../../common-ui/message-input/message-input.component';
import {ChatsService} from '../../../../data/services/chats.service';
import {Chat, Message, MessageGroup} from '../../../../data/interfaces/chats.interface';
import {auditTime, firstValueFrom, fromEvent, Subject, takeUntil, Subscription} from 'rxjs';

@Component({
  selector: 'app-chat-workspace-message-wrapper',
  imports: [
    ChatWorkspaceMessageComponent,
    MessageInputComponent
  ],
  standalone: true,
  templateUrl: './chat-workspace-message-wrapper.component.html',
  styleUrl: './chat-workspace-message-wrapper.component.scss'
})
export class ChatWorkspaceMessageWrapperComponent implements OnInit, OnDestroy {
  chatsService = inject(ChatsService)
  r2 = inject(Renderer2)
  hostElement = inject(ElementRef)

  private destroy$ = new Subject<void>();
  private pollingSubscription?: Subscription;

  chat = input.required<Chat>()

  messages = this.chatsService.activeChatMessages

  // Группированные сообщения
  groupedMessages = computed(() => {
    return this.groupMessagesByDate(this.messages());
  });

  ngOnInit() {
    this.startMessagePolling();
  }

  ngAfterViewInit() {
    this.resizeFeed()

     fromEvent(window, 'resize')
       .pipe(
         auditTime(100),
         takeUntil(this.destroy$)
       ).subscribe(() => {
        this.resizeFeed()
     })
  }

  private startMessagePolling() {
    const chatId = this.chat().id;
    const currentUser = this.chatsService.me();
    
    if (!currentUser) {
      console.warn('User not loaded, skipping message polling');
      return;
    }
    
    this.pollingSubscription = this.chatsService.startPollingMessages(chatId, 3000)
      .subscribe({
        next: (chat) => {
          console.log('Messages updated:', chat.messages.length);
        },
        error: (error) => {
          console.error('Error polling messages:', error);
        }
      });
  }

  // Методы для группировки сообщений
  private groupMessagesByDate(messages: Message[]): MessageGroup[] {
    if (!messages || messages.length === 0) {
      return [];
    }

    // Сортируем сообщения по дате
    const sortedMessages = [...messages].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const groups: MessageGroup[] = [];
    let currentGroup: MessageGroup | null = null;

    sortedMessages.forEach(message => {
      const messageDate = new Date(message.createdAt);
      const messageDateString = messageDate.toDateString(); // Только дата без времени

      if (!currentGroup || currentGroup.date.toDateString() !== messageDateString) {
        // Создаем новую группу
        currentGroup = {
          date: messageDate,
          messages: []
        };
        groups.push(currentGroup);
      }

      currentGroup.messages.push(message);
    });

    return groups;
  }

  getRelativeDateString(date: Date): string {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const messageDate = new Date(date);
    
    if (this.isSameDay(messageDate, today)) {
      return 'Сегодня';
    } else if (this.isSameDay(messageDate, yesterday)) {
      return 'Вчера';
    } else {
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString();
  }

  resizeFeed() {
    const {top} = this.hostElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - 24 - 24;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }

  ngOnDestroy() {
    this.chatsService.stopPollingMessages();
    this.pollingSubscription?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  async onSendMessage(messageText: string) {
    try {
      await firstValueFrom(this.chatsService.sendMessage(this.chat().id, messageText))
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }
}
