import {Component, EventEmitter, HostBinding, inject, input, Output, Renderer2} from '@angular/core';
import { NgIf } from "@angular/common"
import { AvatarCircleComponent } from "../../../common-ui/avatar-circle/avatar-circle.component";
import { ProfileService } from '../../../data/services/profile.service';
import { SvgIconComponent } from '../../../common-ui/svg-icon/svg-icon.component';
import { PostService } from '../../../data/services/post.service';
import { FormsModule } from "@angular/forms";
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-post-input',
  imports: [NgIf, AvatarCircleComponent, SvgIconComponent, FormsModule],
  templateUrl: './post-input.component.html',
  styleUrl: './post-input.component.scss'
})
export class PostInputComponent {
  r2 = inject(Renderer2)
  profile = inject(ProfileService).me
  postId = input<number>(0);
  isCommentInput = input(false);

  @Output() created = new EventEmitter<string>();

  @HostBinding('class.comment')
  get isComment() {
    return this.isCommentInput()
  }

  postText: string = ''

  onTextAreaInput($event: Event) {
    const textarea = $event.target as HTMLTextAreaElement

    this.r2.setStyle(textarea, 'height', 'auto')
    this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px')
  }

  onCreatePost() {
    if(!this.postText) return
    this.created.emit(this.postText)
    this.postText = ''
  }
}
