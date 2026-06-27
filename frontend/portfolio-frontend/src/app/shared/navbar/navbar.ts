import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  inject,
  PLATFORM_ID,
  ChangeDetectionStrategy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { CommandPalette } from '../command-palette/command-palette';
import { NavigationIntentService } from '../../core/services/navigation-intent.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly navIntent = inject(NavigationIntentService);

  /** Whether the user has scrolled past the threshold */
  readonly scrolled = signal(false);

  /** Currently visible section id (for scroll-based active state on home) */
  readonly activeSection = signal('home');

  /** Current route URL for conditional logic */
  readonly currentUrl = signal('/');

  /** Whether to show ⌘ or Ctrl */
  readonly isMac = signal(false);

  /** Reference to the injected command palette */
  private commandPalette: CommandPalette | null = null;

  /** Sections that scroll on the home page (NOT projects — that's a route now) */
  readonly scrollSections = ['about', 'experience', 'contact'];

  /** Route-based nav items (real navigation, always) */
  readonly routeLinks = [
    { label: 'projects', path: '/projects' },
    { label: 'certifications', path: '/certifications' },
  ];

  private observer: IntersectionObserver | null = null;
  private boundScroll: (() => void) | null = null;
  private routeSub: Subscription | null = null;

  /** Accept a reference to the CommandPalette from the parent */
  registerCommandPalette(palette: CommandPalette): void {
    this.commandPalette = palette;
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.isMac.set(/Mac|iPhone|iPad|iPod/.test(navigator.platform));

    // Track the current URL
    this.currentUrl.set(this.router.url);
    this.routeSub = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e) => {
        const navEnd = e as NavigationEnd;
        this.currentUrl.set(navEnd.urlAfterRedirects);

        // Re-setup or disconnect IntersectionObserver based on route
        if (navEnd.urlAfterRedirects === '/') {
          this.setupIntersectionObserver();
        } else {
          this.observer?.disconnect();
          this.observer = null;
          // Clear active section when not on home
          this.activeSection.set('');
        }
      });

    // Scroll listener for navbar background
    this.boundScroll = () => {
      this.scrolled.set(window.scrollY > 20);
    };
    window.addEventListener('scroll', this.boundScroll, { passive: true });

    // Set up IntersectionObserver if we start on '/'
    if (this.router.url === '/') {
      this.setupIntersectionObserver();
    }
  }

  ngOnDestroy(): void {
    if (this.boundScroll) {
      window.removeEventListener('scroll', this.boundScroll);
    }
    this.observer?.disconnect();
    this.routeSub?.unsubscribe();
  }

  /**
   * Smart scroll-or-navigate: if on '/', scroll directly.
   * If on another route, queue the target and navigate home.
   */
  navigateToSection(sectionId: string, event: Event): void {
    event.preventDefault();

    if (this.currentUrl() === '/') {
      // Already on home — just scroll
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // On another route — set intent then navigate
      this.navIntent.setPendingScroll(sectionId);
      this.router.navigateByUrl('/');
    }
  }

  /** Navigate home (logo click) */
  goHome(event: Event): void {
    event.preventDefault();
    if (this.currentUrl() === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      this.router.navigateByUrl('/');
    }
  }

  openPalette(): void {
    this.commandPalette?.open();
  }

  onHamburgerClick(): void {
    this.commandPalette?.open();
  }

  /**
   * Whether a scroll-based section link should be highlighted.
   * Only active when on the home route.
   */
  isSectionActive(sectionId: string): boolean {
    return this.currentUrl() === '/' && this.activeSection() === sectionId;
  }

  private setupIntersectionObserver(): void {
    // Disconnect any existing observer first
    this.observer?.disconnect();
    this.observer = null;

    // Delay slightly so section elements exist in the DOM
    setTimeout(() => {
      const sectionIds = ['home', ...this.scrollSections];
      const elements = sectionIds
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => el !== null);

      if (elements.length === 0) return;

      this.observer = new IntersectionObserver(
        (entries) => {
          // Find the entry with highest intersection ratio
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

          if (visible.length > 0) {
            this.activeSection.set(visible[0].target.id);
          }
        },
        {
          rootMargin: '-80px 0px -40% 0px',
          threshold: [0, 0.25, 0.5, 0.75, 1],
        }
      );

      elements.forEach((el) => this.observer!.observe(el));
    }, 500);
  }
}
