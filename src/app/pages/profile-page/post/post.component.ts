import {Component, inject, input, OnInit, signal} from '@angular/core';
import { DatePipe } from '@angular/common';
import { Post, PostComment } from '../../../data/interfaces/post.interface';
import { SvgIconComponent } from '../../../common-ui/svg-icon/svg-icon.component';
import { AvatarCircleComponent } from "../../../common-ui/avatar-circle/avatar-circle.component";
import { PostInputComponent } from "../post-input/post-input.component";
import { CommentComponent } from "./comment/comment.component";
import {firstValueFrom} from 'rxjs';
import {PostService} from '../../../data/services/post.service';
import {TimePipe} from '../../../helpers/pipes/time.pipe';
import {ProfileService} from '../../../data/services/profile.service';

@Component({
  selector: 'app-post',
  imports: [
    AvatarCircleComponent,
    SvgIconComponent,
    PostInputComponent,
    CommentComponent,
    TimePipe
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit {
  post = input<Post>()
  profile = inject(ProfileService).me
  comments = signal<PostComment[]>([])

  postService = inject(PostService)

  async ngOnInit() {
    this.comments.set(this.post()!.comments)
  }

  async onCreated(commentText: string) {
    await firstValueFrom(this.postService.createComment({
      text: commentText,
      authorId: this.profile()!.id,
      postId: this.post()!.id
    }))
      .then(async() => {
        const comments = await firstValueFrom(this.postService.getCommentsByPostId(this.post()!.id))
        this.comments.set(comments)
      })
      .catch((error) => console.error('Error'))
  }
}
