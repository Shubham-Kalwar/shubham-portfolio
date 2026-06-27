import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  ChangeDetectionStrategy,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-custom-cursor',
  imports: [],
  templateUrl: './custom-cursor.html',
  styleUrl: './custom-cursor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomCursor implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);

  /** Whether this device supports a fine pointer (mouse) */
  readonly enabled = signal(false);

  /** Whether the cursor is hovering an interactive element */
  readonly hovering = signal(false);

  private cursorEl: HTMLElement | null = null;
  private mouseX = 0;
  private mouseY = 0;
  private rafId = 0;
  private boundMouseMove: ((e: MouseEvent) => void) | null = null;
  private boundMouseOver: ((e: Event) => void) | null = null;
  private boundMouseOut: ((e: Event) => void) | null = null;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Skip on touch devices
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    if (isCoarse) return;

    this.enabled.set(true);

    // Wait one tick for the template to render
    requestAnimationFrame(() => {
      this.cursorEl = document.getElementById('custom-cursor');
      if (!this.cursorEl) return;

      this.boundMouseMove = (e: MouseEvent) => {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
      };

      this.boundMouseOver = (e: Event) => {
        const target = e.target as HTMLElement;
        if (this.isInteractive(target)) {
          this.hovering.set(true);
        }
      };

      this.boundMouseOut = (e: Event) => {
        const target = e.target as HTMLElement;
        if (this.isInteractive(target)) {
          this.hovering.set(false);
        }
      };

      document.addEventListener('mousemove', this.boundMouseMove, { passive: true });
      document.addEventListener('mouseover', this.boundMouseOver, { passive: true });
      document.addEventListener('mouseout', this.boundMouseOut, { passive: true });

      // Hide native cursor
      document.documentElement.classList.add('custom-cursor-active');

      this.tick();
    });
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    cancelAnimationFrame(this.rafId);

    if (this.boundMouseMove) {
      document.removeEventListener('mousemove', this.boundMouseMove);
    }
    if (this.boundMouseOver) {
      document.removeEventListener('mouseover', this.boundMouseOver);
    }
    if (this.boundMouseOut) {
      document.removeEventListener('mouseout', this.boundMouseOut);
    }

    document.documentElement.classList.remove('custom-cursor-active');
  }

  private tick(): void {
    if (this.cursorEl) {
      this.cursorEl.style.transform = `translate(${this.mouseX}px, ${this.mouseY}px)`;
    }
    this.rafId = requestAnimationFrame(() => this.tick());
  }

  private isInteractive(el: HTMLElement): boolean {
    if (!el) return false;

    const tag = el.tagName.toLowerCase();
    if (tag === 'a' || tag === 'button') return true;
    if (el.hasAttribute('data-cursor-interactive')) return true;

    // Walk up at most 3 levels to catch spans inside <a>/<button>
    let parent = el.parentElement;
    for (let i = 0; i < 3 && parent; i++) {
      const parentTag = parent.tagName.toLowerCase();
      if (parentTag === 'a' || parentTag === 'button') return true;
      if (parent.hasAttribute('data-cursor-interactive')) return true;
      parent = parent.parentElement;
    }

    return false;
  }
}
