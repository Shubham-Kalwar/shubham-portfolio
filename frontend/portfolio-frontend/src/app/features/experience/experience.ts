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
import { Experience as ExperienceModel } from '../../core/models';

@Component({
  selector: 'app-experience',
  imports: [],
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceSection implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly portfolioService = inject(PortfolioService);
  private readonly hostEl = inject(ElementRef<HTMLElement>);

  readonly experiences = signal<ExperienceModel[]>([]);
  readonly loading = signal(true);
  readonly visible = signal(false);

  private observer: IntersectionObserver | null = null;

  ngOnInit(): void {
    this.portfolioService.getExperience().subscribe({
      next: (data) => {
        this.experiences.set(data);
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

  isInternship(exp: ExperienceModel): boolean {
    return exp.type === 'INTERNSHIP';
  }

  isBestPerformer(exp: ExperienceModel): boolean {
    return exp.highlight;
  }
}
