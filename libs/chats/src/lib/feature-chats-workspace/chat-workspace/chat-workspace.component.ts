import { Component, inject } from '@angular/core';
import { ChatWorkspaceHeaderComponent } from './chat-workspace-header/chat-workspace-header.component';
import { ChatWorkspaceMessageWrapperComponent } from './chat-workspace-message-wrapper/chat-workspace-message-wrapper.component';
import {ActivatedRoute, Router} from '@angular/router';
import { of, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ChatsService } from '@tt/data-access';

@Component({
  selector: 'app-chat-workspace',
  imports: [
    ChatWorkspaceHeaderComponent,
    ChatWorkspaceMessageWrapperComponent,
    AsyncPipe,
  ],
  templateUrl: './chat-workspace.component.html',
  styleUrl: './chat-workspace.component.scss',
})
export class ChatWorkspaceComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  chatService = inject(ChatsService);

  activeChat$ = this.route.params.pipe(
    switchMap(({ id }) => {
      if (id === 'new') {
        return this.route.queryParams.pipe(
          switchMap(({ userId }) =>
            this.chatService.createChat(userId).pipe(
              switchMap((chat) => {
                this.router.navigate(['chats', chat.id]);
                return of(null);
              })
            )
          )
        );
      }

      return this.chatService.getChatById(id);
    })
  );
}
