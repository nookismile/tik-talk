import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Chat, LastMessageRes, Message} from '../interfaces/chats.interface';
import {ProfileService} from './profile.service';
import {map, switchMap, tap, timer, interval, startWith, takeUntil, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {
  http = inject(HttpClient);
  me = inject(ProfileService).me;

  activeChatMessages = signal<Message[]>([])
  private destroy$ = new Subject<void>();

  baseApiUrl = 'https://icherniakov.ru/yt-course';
  chatsUrl = `${this.baseApiUrl}/chat/`;
  messageUrl = `${this.baseApiUrl}/message/`;

  createChat(userId: number) {
    return this.http.post<Chat>(`${this.chatsUrl}${userId}`, {});
  }

  getMyChats() {
    return this.http.get<LastMessageRes[]>(`${this.chatsUrl}get_my_chats/`);
  }

  getChatById(chatId: number) {
    return this.http.get<Chat>(`${this.chatsUrl}${chatId}`)
      .pipe(map(chat => {
        const currentUser = this.me();
        
        const patchedMessages = chat.messages.map(message => {
          return {
            ...message,
            user: chat.userFirst.id === message.userFromId ? chat.userFirst : chat.userSecond,
            isMine: currentUser ? message.userFromId === currentUser.id : false,
          }
        })
        this.activeChatMessages.set(patchedMessages)
        return {
          ...chat,
          companion: currentUser ? 
            (chat.userFirst.id === currentUser.id ? chat.userSecond : chat.userFirst) : 
            chat.userFirst,
          messages: patchedMessages,
        }
    }))
  }

  sendMessage(chatId: number, message: string) {
    return this.http.post(`${this.messageUrl}send/${chatId}`, {}, {
      params: {
        message
      }
    }).pipe(
      switchMap(() => {
        return this.getChatById(chatId)
      })
    );
  }

  // Новый метод для периодического обновления сообщений
  startPollingMessages(chatId: number, intervalMs: number = 3000) {
    // Останавливаем предыдущий polling если он был
    this.stopPollingMessages();
    
    return timer(0, intervalMs).pipe(
      switchMap(() => this.getChatById(chatId)),
      takeUntil(this.destroy$)
    );
  }

  // Метод для остановки polling
  stopPollingMessages() {
    this.destroy$.next();
  }

  // Метод для очистки при уничтожении сервиса
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
