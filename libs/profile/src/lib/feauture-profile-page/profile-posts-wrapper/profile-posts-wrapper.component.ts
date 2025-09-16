import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { PostFeedComponent } from '@tt/posts';

@Component({
  selector: 'app-profile-posts-wrapper',
  template: `
    <div class="profile-posts">
      <ng-container *ngIf="showPosts">
        <app-post-feed></app-post-feed>
      </ng-container>
    </div>
  `,
  styles: [`
    .profile-posts {
      padding: 16px;
    }
    .posts-placeholder {
      text-align: center;
      padding: 32px;
      color: #666;
    }
  `],
  standalone: true,
  imports: [NgIf, PostFeedComponent]
})
export class ProfilePostsWrapperComponent {
  @Input() showPosts = true;
}
