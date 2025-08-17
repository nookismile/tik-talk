import { Component, inject } from '@angular/core';
import { AsyncPipe, NgForOf } from '@angular/common';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { SubscriberCardComponent } from './subscriber-card/subscriber-card.component';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import {AvatarCircleComponent, SvgIconComponent} from '@tt/common-ui';
import { GlobalStoreService } from '@tt/shared';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    SvgIconComponent,
    NgForOf,
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
    SubscriberCardComponent,
    AvatarCircleComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  globalStore = inject(GlobalStoreService);
  profileService = inject(ProfileService);

  subscribers$ = this.profileService.getSubscribersShortList();

  me = this.globalStore.me;

  menuItems = [
    {
      label: 'Моя страница',
      icon: 'home',
      link: 'profile/me',
    },
    {
      label: 'Чаты',
      icon: 'chats',
      link: 'chats',
    },
    {
      label: 'Поиск',
      icon: 'search',
      link: 'search',
    },
  ];

  ngOnInit() {
    firstValueFrom(this.profileService.getMe());
  }
}
