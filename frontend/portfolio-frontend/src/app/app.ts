import {
  Component,
  signal,
  viewChild,
  AfterViewInit,
  OnInit,
  OnDestroy,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { RouterOutlet, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs';
import { BootSequence } from './shared/boot-sequence/boot-sequence';
import { CustomCursor } from './shared/custom-cursor/custom-cursor';
import { CommandPalette } from './shared/command-palette/command-palette';
import { Navbar } from './shared/navbar/navbar';
import { Footer } from './shared/footer/footer';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    BootSequence, CustomCursor, CommandPalette, Navbar, Footer,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);

  protected readonly title = signal('portfolio-frontend');

  /** Scroll progress bar width (0-100) */
  readonly scrollProgress = signal(0);

  /** Whether the "back to top" button should show */
  readonly showBackToTop = signal(false);

  /** Route-change fade state */
  readonly routeFading = signal(false);

  readonly navbar = viewChild(Navbar);
  readonly commandPalette = viewChild(CommandPalette);

  private rafId: number | null = null;
  private ticking = false;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    window.addEventListener('scroll', this.onScroll, { passive: true });

    // Route-change fade: fade out on NavigationStart, fade in on NavigationEnd
    this.router.events
      .pipe(filter((e) => e instanceof NavigationStart))
      .subscribe(() => this.routeFading.set(true));

    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        // Let the new view render, then fade in
        setTimeout(() => this.routeFading.set(false), 20);
      });
  }

  ngAfterViewInit(): void {
    const nav = this.navbar();
    const palette = this.commandPalette();
    if (nav && palette) {
      nav.registerCommandPalette(palette);
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll);
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /** Throttled scroll handler via requestAnimationFrame */
  private onScroll = (): void => {
    if (this.ticking) return;
    this.ticking = true;

    this.rafId = requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

      this.scrollProgress.set(Math.min(progress, 100));
      this.showBackToTop.set(scrollY > 400);
      this.ticking = false;
    });
  };
}
