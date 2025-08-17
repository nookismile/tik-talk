import {
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  Renderer2,
  computed,
} from '@angular/core';
import { ChatWorkspaceMessageComponent } from './chat-workspace-message/chat-workspace-message.component';
import {
  Chat,
  Message,
  MessageGroup,
} from '@tt/interfaces/chats.interface';
import { MessageGroupingHelper } from '../../../helpers/message-grouping.helper';
import {
  auditTime,
  firstValueFrom,
  fromEvent,
  Subject,
  takeUntil,
  Subscription,
} from 'rxjs';
import {MessageInputComponent} from '../../../ui/message-input/message-input.component';
import {ChatsService} from '../../../../../../data-access/src/lib/chats/services/chats.service';

@Component({
  selector: 'app-chat-workspace-message-wrapper',
  imports: [ChatWorkspaceMessageComponent, MessageInputComponent],
  standalone: true,
  templateUrl: './chat-workspace-message-wrapper.component.html',
  styleUrl: './chat-workspace-message-wrapper.component.scss',
})
export class ChatWorkspaceMessageWrapperComponent implements OnInit, OnDestroy {
  chatsService = inject(ChatsService);
  r2 = inject(Renderer2);
  hostElement = inject(ElementRef);

  private destroy$ = new Subject<void>();
  private pollingSubscription?: Subscription;

  chat = input.required<Chat>();

  messages = this.chatsService.activeChatMessages;

  groupedMessages = computed(() => {
    return MessageGroupingHelper.groupMessagesByDate(this.messages());
  });

  ngOnInit() {
    this.startMessagePolling();
  }

  ngAfterViewInit() {
    this.resizeFeed();

    fromEvent(window, 'resize')
      .pipe(auditTime(100), takeUntil(this.destroy$))
      .subscribe(() => {
        this.resizeFeed();
      });
  }

  private startMessagePolling() {
    const chatId = this.chat().id;
    const currentUser = this.chatsService.me();

    if (!currentUser) {
      console.warn('User not loaded, skipping message polling');
      return;
    }

    this.pollingSubscription = this.chatsService
      .startPollingMessages(chatId, 3000)
      .subscribe({
        next: (chat) => {
          console.log('Messages updated:', chat.messages.length);
        },
        error: (error) => {
          console.error('Error polling messages:', error);
        },
      });
  }



  getRelativeDateString(date: Date): string {
    return MessageGroupingHelper.getRelativeDateString(date);
  }

  resizeFeed() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();
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
      await firstValueFrom(
        this.chatsService.sendMessage(this.chat().id, messageText)
      );
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
}
