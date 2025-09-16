import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { ChatWSMessage } from "../interfaces/chats-ws-message.interface";
import { ChatConnectionWSParams, ChatWsService } from '@tt/data-access';
import { finalize, Observable, tap } from 'rxjs';

export class ChatsWsRxjsService implements ChatWsService {
    #socket: WebSocketSubject<ChatWSMessage> | null = null;

    connect(params: ChatConnectionWSParams): Observable<ChatWSMessage> {
        if (!this.#socket) {
            this.#socket = webSocket({
                url: params.url,
                protocol: [params.token]
             })
        }
       
        return this.#socket.asObservable()
            .pipe(
                tap(message => params.handleMessage(message)),
                finalize(() => console.log('close'))
            )
    }

    sendMessage(text: string, chatId: number): void {
        this.#socket?.next({
            text,
            chat_id: chatId
        })
    }

    disconnect() {
        this.#socket?.complete()
    }
}