import {
  Component,
  inject,
  signal,
  effect,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { BackendStatusService, BackendStatus } from '../../core/services/backend-status.service';

@Component({
  selector: 'app-backend-status-banner',
  standalone: true,
  templateUrl: './backend-status-banner.html',
  styleUrl: './backend-status-banner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackendStatusBanner implements OnDestroy {
  private readonly backendStatus = inject(BackendStatusService);

  /** Whether the banner DOM should exist */
  readonly visible = signal(false);

  /** Whether the banner is fading out (triggers CSS opacity transition) */
  readonly fadingOut = signal(false);

  /** Expose the raw status for template binding */
  readonly status = this.backendStatus.status;

  private fadeTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    // Kick off the health check
    this.backendStatus.ping();

    // React to status changes
    effect(() => {
      const s: BackendStatus = this.status();

      if (s === 'waking' || s === 'error') {
        this.fadingOut.set(false);
        this.visible.set(true);
      } else if (s === 'ready' && this.visible()) {
        // Fade out, then remove from DOM
        this.fadingOut.set(true);
        this.fadeTimer = setTimeout(() => {
          this.visible.set(false);
          this.fadingOut.set(false);
        }, 350); // slightly longer than the 300ms CSS transition
      }
    });
  }

  ngOnDestroy(): void {
    if (this.fadeTimer) clearTimeout(this.fadeTimer);
  }
}
