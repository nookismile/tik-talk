import { Component, input } from '@angular/core';
import { AvatarCircleComponent } from "../../../../common-ui/avatar-circle/avatar-circle.component";
import { PostComment } from '../../../../data/interfaces/post.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-comment',
  imports: [AvatarCircleComponent, DatePipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent {
  comment = input<PostComment>()
}
