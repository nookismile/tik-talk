import {
  Component,
  EventEmitter,
  inject,
  Output,
  Renderer2,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import {AvatarCircleComponent, SvgIconComponent} from '@tt/common-ui';
import { GlobalStoreService } from '@tt/shared';

@Component({
  selector: 'app-message-input',
  imports: [AvatarCircleComponent, FormsModule, NgIf, SvgIconComponent],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.scss',
})
export class MessageInputComponent {
  r2 = inject(Renderer2);
  globalStore = inject(GlobalStoreService);

  @Output() created = new EventEmitter<string>();

  postText: string = '';

  onTextAreaInput($event: Event) {
    const textarea = $event.target as HTMLTextAreaElement;

    this.r2.setStyle(textarea, 'height', 'auto');
    this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px');
  }

  onCreatePost() {
    if (!this.postText) return;

    this.created.emit(this.postText);
    this.postText = '';
  }
}
