import { Component, inject, input, OnInit, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CommentComponent, PostInputComponent } from '../../ui';
import {AvatarCircleComponent, SvgIconComponent, TimePipe} from '@tt/common-ui';
import { GlobalStoreService } from '@tt/shared';
import type {Post, PostComment} from '../../data';
import {PostService} from '../../data';

@Component({
  selector: 'app-post',
  imports: [
    AvatarCircleComponent,
    SvgIconComponent,
    PostInputComponent,
    CommentComponent,
    TimePipe,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent implements OnInit {
  post = input<Post>();
  globalStore = inject(GlobalStoreService);
  comments = signal<PostComment[]>([]);

  postService = inject(PostService);

  async ngOnInit() {
    this.comments.set(this.post()!.comments);
  }

  async onCreated(commentText: string) {
    await firstValueFrom(
      this.postService.createComment({
        text: commentText,
        authorId: this.globalStore.me()!.id,
        postId: this.post()!.id,
      })
    )
      .then(async () => {
        const comments = await firstValueFrom(
          this.postService.getCommentsByPostId(this.post()!.id)
        );
        this.comments.set(comments);
      })
      .catch((error) => console.error('Error'));
  }
}
