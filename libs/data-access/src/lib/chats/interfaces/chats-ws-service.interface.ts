import { Observable } from "rxjs"
import { ChatWSMessage } from "./chats-ws-message.interface"

export interface ChatConnectionWSParams {
    url: string,
    token: string,
    handleMessage: (message: ChatWSMessage) => void
}


export interface ChatWsService {
    connect: (params: ChatConnectionWSParams) => void | Observable<ChatWSMessage>
    sendMessage: (text: string, chatId: number) => void
    disconnect: () => void
}
