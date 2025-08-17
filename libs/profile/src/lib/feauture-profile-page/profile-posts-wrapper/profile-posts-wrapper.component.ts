import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-profile-posts-wrapper',
  template: `
    <div class="profile-posts">
      <!-- Здесь будет динамически загруженный PostFeedComponent -->
      <ng-container *ngIf="showPosts">
        <!-- Временная заглушка, пока не решим проблему с циклическими зависимостями -->
        <div class="posts-placeholder">
          <p>Посты пользователя будут отображаться здесь</p>
        </div>
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
  standalone: true
})
export class ProfilePostsWrapperComponent {
  @Input() showPosts = true;
}
