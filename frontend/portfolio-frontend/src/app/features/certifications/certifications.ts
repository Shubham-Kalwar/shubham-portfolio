import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  inject,
  PLATFORM_ID,
  ElementRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PortfolioService } from '../../core/services/portfolio.service';
import { Certificate } from '../../core/models';

@Component({
  selector: 'app-certifications',
  imports: [],
  templateUrl: './certifications.html',
  styleUrl: './certifications.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Certifications implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly portfolioService = inject(PortfolioService);
  private readonly hostEl = inject(ElementRef<HTMLElement>);

  readonly certifications = signal<Certificate[]>([]);
  readonly loading = signal(true);
  readonly visible = signal(false);

  readonly skeletons = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  private observer: IntersectionObserver | null = null;

  ngOnInit(): void {
    this.portfolioService.getCertificatesByCategory('CERTIFICATION').subscribe({
      next: (data) => {
        this.certifications.set(data);
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
      { threshold: 0.05 }
    );
    this.observer.observe(this.hostEl.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
