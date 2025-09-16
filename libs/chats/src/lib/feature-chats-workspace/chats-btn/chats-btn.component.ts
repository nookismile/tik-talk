import { Component, computed, inject, input } from '@angular/core';
import {AvatarCircleComponent} from '@tt/common-ui';
import { LastMessageRes } from '@tt/data-access/chats';
import { ChatsService } from '@tt/data-access';


@Component({
  selector: 'button[chats]',
  imports: [AvatarCircleComponent],
  templateUrl: './chats-btn.component.html',
  styleUrl: './chats-btn.component.scss',
})
export class ChatsBtnComponent {
  chat = input<LastMessageRes>();
  #chatsService = inject(ChatsService);

  unreadCount = computed(() => {
    const chat = this.chat();
    if (!chat) return 0;
    const map = this.#chatsService.unreadByChatId();
    return map[chat.id] ?? 0;
  })
}
