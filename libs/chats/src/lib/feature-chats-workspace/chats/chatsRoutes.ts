import { Route } from '@angular/router';
import { ChatWorkspaceComponent } from '../../feature-chats-workspace/chat-workspace/chat-workspace.component';
import { ChatsPageComponent } from './chats.component';

export const chatsRoutes: Route[] = [
  {
    path: '',
    component: ChatsPageComponent,
    children: [{ path: ':id', component: ChatWorkspaceComponent }],
  },
];
