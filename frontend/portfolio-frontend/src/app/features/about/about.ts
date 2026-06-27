import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  inject,
  PLATFORM_ID,
  ChangeDetectionStrategy,
  ElementRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PortfolioService } from '../../core/services/portfolio.service';
import { SkillsGrouped } from '../../core/models';

const CATEGORY_LABELS: Record<string, string> = {
  LANGUAGE: 'Languages',
  FRONTEND: 'Frontend',
  BACKEND: 'Backend',
  DATABASE: 'Database',
  DEVOPS: 'DevOps',
  TOOLS: 'Tools',
};

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly portfolioService = inject(PortfolioService);
  private readonly hostEl = inject(ElementRef<HTMLElement>);

  /** Grouped skills from backend */
  readonly skills = signal<SkillsGrouped>({});

  /** Whether skills are loading */
  readonly loading = signal(true);

  /** Whether section has been scrolled into view */
  readonly visible = signal(false);

  /** Ordered category keys (preserves backend order) */
  readonly categoryKeys = signal<string[]>([]);

  private observer: IntersectionObserver | null = null;

  readonly categoryLabels = CATEGORY_LABELS;

  ngOnInit(): void {
    this.portfolioService.getSkills().subscribe({
      next: (data) => {
        this.skills.set(data);
        this.categoryKeys.set(Object.keys(data));
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });

    if (!isPlatformBrowser(this.platformId)) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          this.visible.set(true);
          this.observer?.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    this.observer.observe(this.hostEl.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  getSkillsForCategory(category: string): string[] {
    const group = this.skills()[category];
    return group ? group.map((s) => s.name) : [];
  }

  labelFor(category: string): string {
    return this.categoryLabels[category] ?? category;
  }
}
