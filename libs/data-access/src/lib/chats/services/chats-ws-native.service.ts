import { ChatWsService, ChatConnectionWSParams } from "../interfaces";

export class ChatWsNativeService implements ChatWsService {

    #socket: WebSocket | null = null;
    
    connect(params: ChatConnectionWSParams) {
        if (this.#socket) return

        this.#socket = new WebSocket(params.url, [params.token]);

        this.#socket.onmessage = (event: MessageEvent) => {
            params.handleMessage(JSON.parse(event.data))
        }

        this.#socket.onclose = () => {
            console.log('close')
        }
    }

    sendMessage(text: string, chatId: number) {
        this.#socket?.send(
            JSON.stringify({
                text,
                chatId: chatId
            })
        )
    }

    disconnect() {
        this.#socket?.close()
    }
}