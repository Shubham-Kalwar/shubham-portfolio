import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  computed,
  inject,
  PLATFORM_ID,
  ElementRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PortfolioService } from '../../core/services/portfolio.service';
import { Certificate } from '../../core/models';

@Component({
  selector: 'app-achievements',
  imports: [],
  templateUrl: './achievements.html',
  styleUrl: './achievements.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Achievements implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly portfolioService = inject(PortfolioService);
  private readonly hostEl = inject(ElementRef<HTMLElement>);

  readonly achievements = signal<Certificate[]>([]);
  readonly loading = signal(true);
  readonly visible = signal(false);

  /** Cap at 5 cards */
  readonly displayAchievements = computed(() => this.achievements().slice(0, 5));

  /** Skeleton placeholders */
  readonly skeletons = [0, 1, 2, 3, 4];

  private observer: IntersectionObserver | null = null;

  ngOnInit(): void {
    this.portfolioService.getCertificatesByCategory('ACHIEVEMENT').subscribe({
      next: (data) => {
        this.achievements.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    if (!isPlatformBrowser(this.platformId)) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          this.visible.set(true);
          this.observer?.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    this.observer.observe(this.hostEl.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
