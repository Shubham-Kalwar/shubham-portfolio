import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  computed,
  input,
  inject,
  PLATFORM_ID,
  ElementRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PortfolioService } from '../../core/services/portfolio.service';
import { Project } from '../../core/models';

export type ProjectsMode = 'featured' | 'full';

@Component({
  selector: 'app-projects',
  imports: [RouterLink],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Projects implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly portfolioService = inject(PortfolioService);
  private readonly hostEl = inject(ElementRef<HTMLElement>);

  /** 'featured' (home page) | 'full' (projects page) — defaults to 'full' */
  readonly mode = input<ProjectsMode>('full');

  // ── Data ────────────────────────────────────────────────────────────────
  readonly featuredProjects = signal<Project[]>([]);
  readonly allProjects = signal<Project[]>([]);
  readonly loading = signal(true);
  readonly visible = signal(false);

  // ── Filter (full mode only) ─────────────────────────────────────────────
  readonly activeFilter = signal('--all');

  /** Expand state for directory rows (full mode only) — stores project id */
  readonly expandedId = signal<number | null>(null);

  // ── Hover effects ───────────────────────────────────────────────────────
  readonly glitchIndex = signal(-1);
  readonly scanlineIndex = signal(-1);

  /** Skeleton placeholder array */
  readonly skeletons = [0, 1, 2, 3, 4, 5];

  // ── Computed ─────────────────────────────────────────────────────────────

  /** Featured cards, capped at 6 */
  readonly featuredCapped = computed(() => this.featuredProjects().slice(0, 6));

  /**
   * Dynamic filter tags derived from the actual tech stacks across all projects.
   * Groups common tech families into single flags automatically.
   */
  readonly dynamicFilters = computed(() => {
    const allTech = this.allProjects()
      .flatMap((p) => p.techStackList.map((t) => t.toLowerCase()));

    const families: { flag: string; label: string; keywords: string[] }[] = [
      { flag: '--java',    label: '--java',    keywords: ['java', 'spring'] },
      { flag: '--python',  label: '--python',  keywords: ['python', 'flask', 'fastapi'] },
      { flag: '--angular', label: '--angular', keywords: ['angular'] },
      { flag: '--react',   label: '--react',   keywords: ['react'] },
      { flag: '--ml',      label: '--ml',      keywords: ['yolo', 'tensorflow', 'keras', 'opencv', 'ml', 'scikit'] },
      { flag: '--docker',  label: '--docker',  keywords: ['docker'] },
    ];

    const present = families.filter((f) =>
      f.keywords.some((kw) => allTech.some((t) => t.includes(kw)))
    );

    return [
      { flag: '--all', label: '--all' },
      ...present.map((f) => ({ flag: f.flag, label: f.label })),
    ];
  });

  /** Projects shown in directory listing, filtered */
  readonly filteredAllProjects = computed(() => {
    if (this.activeFilter() === '--all') return this.allProjects();

    const families: Record<string, string[]> = {
      '--java':    ['java', 'spring'],
      '--python':  ['python', 'flask', 'fastapi'],
      '--angular': ['angular'],
      '--react':   ['react'],
      '--ml':      ['yolo', 'tensorflow', 'keras', 'opencv', 'ml', 'scikit'],
      '--docker':  ['docker'],
    };
    const keywords = families[this.activeFilter()] ?? [];
    return this.allProjects().filter((p) =>
      keywords.some((kw) =>
        p.techStackList.some((t) => t.toLowerCase().includes(kw))
      )
    );
  });

  private observer: IntersectionObserver | null = null;
  private glitchTimeouts: ReturnType<typeof setTimeout>[] = [];

  ngOnInit(): void {
    const isFeatured = this.mode() === 'featured';

    if (isFeatured) {
      // Featured mode: only call /api/projects/featured
      this.portfolioService.getFeaturedProjects().subscribe({
        next: (data) => {
          this.featuredProjects.set(data);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    } else {
      // Full mode: need both featured (rich cards row) + all (directory listing)
      this.portfolioService.getFeaturedProjects().subscribe({
        next: (data) => this.featuredProjects.set(data),
        error: () => {},
      });
      this.portfolioService.getProjects().subscribe({
        next: (data) => {
          this.allProjects.set(data);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    }

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
    this.glitchTimeouts.forEach((id) => clearTimeout(id));
  }

  // ── Actions ──────────────────────────────────────────────────────────────

  setFilter(flag: string): void {
    this.activeFilter.set(flag);
    this.expandedId.set(null); // collapse any open row when filter changes
  }

  toggleExpand(id: number): void {
    this.expandedId.set(this.expandedId() === id ? null : id);
  }

  // ── Card hover effects ───────────────────────────────────────────────────

  onCardEnter(index: number): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.glitchIndex.set(index);
    this.scanlineIndex.set(index);

    let toggles = 0;
    const interval = setInterval(() => {
      toggles++;
      if (toggles >= 6) {
        clearInterval(interval);
        this.glitchIndex.set(-1);
      }
    }, 42);

    const scanTimeout = setTimeout(() => this.scanlineIndex.set(-1), 500);
    this.glitchTimeouts.push(scanTimeout);
  }

  onCardLeave(): void {
    this.glitchIndex.set(-1);
    this.scanlineIndex.set(-1);
  }

  // ── Utilities ────────────────────────────────────────────────────────────

  toSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  formatTechStack(stack: string[]): string {
    return '// ' + stack.join(' · ');
  }

  formatBadge(badge: string): string {
    return `[ ${badge} ]`;
  }
}
