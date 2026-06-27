import { Injectable, signal } from '@angular/core';

/**
 * Holds a pending scroll target for cross-route navigation.
 *
 * Flow: navbar/palette sets a target → navigates to '/' → HomeComponent
 * picks it up on init, scrolls, then clears it.
 */
@Injectable({ providedIn: 'root' })
export class NavigationIntentService {
  /** The section id to scroll to after the home route loads */
  private readonly _pendingScroll = signal<string | null>(null);

  /** Read the current pending target */
  get pendingScroll(): string | null {
    return this._pendingScroll();
  }

  /** Set a scroll target (called before navigating to '/') */
  setPendingScroll(sectionId: string): void {
    this._pendingScroll.set(sectionId);
  }

  /** Consume and clear the pending target (called by HomeComponent) */
  consumePendingScroll(): string | null {
    const target = this._pendingScroll();
    this._pendingScroll.set(null);
    return target;
  }
}
