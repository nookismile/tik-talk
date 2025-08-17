import {
  Component,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { auditTime, firstValueFrom, fromEvent, Subject, takeUntil } from 'rxjs';
import type { Post } from '../../data';
import { PostService } from '../../data';
import { PostComponent } from '../post/post.component';
import { PostInputComponent } from '../../ui';
import { GlobalStoreService } from '@tt/shared';

@Component({
  selector: 'app-post-feed',
  imports: [PostInputComponent, PostComponent],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
})
export class PostFeedComponent implements OnInit, OnDestroy {
  postService = inject(PostService);
  globalStore = inject(GlobalStoreService);
  r2 = inject(Renderer2);
  hostElement = inject(ElementRef);

  private destroy$ = new Subject<void>();

  feed: Post[] = [];

  @Input() postId: number = 0;

  ngOnInit() {
    this.loadPosts();
  }

  // на этом хуке мы имеем доступ к DOM-элементам
  ngAfterViewInit() {
    this.resizeFeed();

    fromEvent(window, 'resize')
      .pipe(auditTime(100), takeUntil(this.destroy$))
      .subscribe(() => {
        this.resizeFeed();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  resizeFeed() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - 24 - 24;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }

  private loadPosts() {
    firstValueFrom(this.postService.fetchPosts()).then((posts) => {
      this.feed = posts;
    });
  }

  onCreatePost(postText: string) {
    if (!postText) return;

    firstValueFrom(
      this.postService.createPost({
        title: 'Клевый пост',
        content: postText,
        authorId: this.globalStore.me()!.id,
      })
    )
      .then(() => {
        this.loadPosts();
      })
      .catch((error) => console.error('Error'));
  }
}
