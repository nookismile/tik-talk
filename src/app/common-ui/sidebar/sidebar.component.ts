import { Component, inject } from '@angular/core';
import {AsyncPipe, NgForOf} from '@angular/common';
import {RouterLinkActive, RouterLink} from '@angular/router';
import {SvgIconComponent} from '../svg-icon/svg-icon.component';
import { SubscriberCardComponent } from "./subscriber-card/subscriber-card.component";
import { ProfileService } from '../../data/services/profile.service';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { AvatarCircleComponent } from "../avatar-circle/avatar-circle.component";

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
    AvatarCircleComponent
],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})

export class SidebarComponent {
  profileService = inject(ProfileService)

  subscribers$ = this.profileService.getSubscribersShortList()

  me = this.profileService.me

  menuItems = [
    {
      label: 'Моя страница',
      icon: 'home',
      link: 'profile/me'
    },
    {
      label: 'Чаты',
      icon: 'chats',
      link: 'chats'
    },
    {
      label: 'Поиск',
      icon: 'search',
      link: 'search'
    }
  ]

  ngOnInit() {
    firstValueFrom(this.profileService.getMe())
  }

}
