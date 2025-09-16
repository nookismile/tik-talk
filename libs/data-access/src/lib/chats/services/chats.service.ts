import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chat, ChatWsService, LastMessageRes, Message } from '../interfaces';
import { Profile } from '../../profile/interfaces';
import {
  map,
  switchMap,
  timer,
  takeUntil,
  Subject,
  Observable,
} from 'rxjs';
import { GlobalStoreService } from '../../shared/services/global-store.service';
import { ChatWsNativeService } from './chats-ws-native.service';
import { AuthService } from '@tt/data-access';
import { ChatWSMessage } from '../interfaces/chats-ws-message.interface';
import { isNewMessage, isUnreadMessage } from '../interfaces/type-guards';
import { ChatsWsRxjsService } from './chats-ws-rxjs.service';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  http = inject(HttpClient);
  #authService = inject(AuthService);
  globalStore = inject(GlobalStoreService);

  wsAdapter: ChatWsService = new ChatsWsRxjsService()

  activeChatMessages = signal<Message[]>([]);
  unreadMessagesCount = signal(0)
  unreadByChatId = signal<Record<number, number>>({})
  activeChatId = signal<number | null>(null)
  private destroy$ = new Subject<void>();

  baseApiUrl = 'https://icherniakov.ru/yt-course';
  chatsUrl = `${this.baseApiUrl}/chat/`;
  messageUrl = `${this.baseApiUrl}/message/`;

  connectWs() {
    return this.wsAdapter.connect({
      url: `${this.baseApiUrl}/chat/ws`,
      token: this.#authService.token ?? '',
      handleMessage: this.handleWSMessage
    }) as Observable<ChatWSMessage>

  }

  //TODO Замыкания 
  handleWSMessage = (message: ChatWSMessage) => {
    if (!('action' in message)) return

    if (isUnreadMessage(message)) {
      this.unreadMessagesCount.set(message.data.count)
    }

    if (isNewMessage(message)) {
      const myId = this.globalStore.me()?.id ?? null;
      const isMine = myId !== null ? message.data.author === myId : false;
      this.activeChatMessages.set([
        ...this.activeChatMessages(),
        {
          id: message.data.id,
          userFromId: message.data.author,
          personalChatId: message.data.chat_id,
          text: message.data.message,
          createdAt: message.data.created_at,
          isRead: false,
          isMine,
        }
      ])

      // Update per-chat unread counter if message is not mine and chat is not active
      const currentActiveChatId = this.activeChatId();
      if (!isMine && currentActiveChatId !== message.data.chat_id) {
        const map = this.unreadByChatId();
        const prev = map[message.data.chat_id] ?? 0;
        this.unreadByChatId.set({ ...map, [message.data.chat_id]: prev + 1 });
        // Optionally keep global counter in sync if the server does not send 'unread'
        // this.unreadMessagesCount.set(this.unreadMessagesCount() + 1)
      }
    }
  }

  createChat(userId: number) {
    return this.http.post<Chat>(`${this.chatsUrl}${userId}`, {});
  }

  getMyChats() {
    return this.http.get<LastMessageRes[]>(`${this.chatsUrl}get_my_chats/`);
  }

  getChatById(chatId: number) {
    return this.http.get<Chat>(`${this.chatsUrl}${chatId}`).pipe(
      map((chat) => {
        const myId = this.globalStore.me()?.id ?? null;
        const messagesWithOwnership = chat.messages.map((m) => ({
          ...m,
          isMine: myId !== null ? m.userFromId === myId : m.isMine ?? false,
        }))
        this.activeChatMessages.set(messagesWithOwnership);
        this.activeChatId.set(chatId);
        // reset per-chat unread counter on open
        const map = this.unreadByChatId();
        if (map[chatId]) {
          const { [chatId]: _, ...rest } = map;
          this.unreadByChatId.set({ ...rest, [chatId]: 0 });
        }
        return {
          ...chat,
          messages: messagesWithOwnership,
        };
      })
    );
  }

  sendMessage(chatId: number, text: string) {
    return this.http.post<Message>(`${this.messageUrl}`, {
      chat_id: chatId,
      text: text,
    });
  }

  startPollingMessages(chatId: number, intervalMs: number = 3000) {
    this.stopPollingMessages();

    return timer(0, intervalMs).pipe(
      switchMap(() => this.getChatById(chatId)),
      takeUntil(this.destroy$)
    );
  }

  stopPollingMessages() {
    this.destroy$.next();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}