import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export type BackendStatus = 'idle' | 'waking' | 'ready' | 'error';

/**
 * Pings the backend health endpoint on app init.
 *
 * If no response arrives within 3 seconds, status moves to 'waking'
 * so the UI can show an informational banner. Once the response
 * arrives (even if slow), status moves to 'ready'. If the request
 * fails outright after ~20 seconds, status moves to 'error'.
 */
@Injectable({ providedIn: 'root' })
export class BackendStatusService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  /** Current backend status — consumed by the banner component */
  readonly status = signal<BackendStatus>('idle');

  private wakingTimer: ReturnType<typeof setTimeout> | null = null;
  private errorTimer: ReturnType<typeof setTimeout> | null = null;

  /** Call once from app init (e.g. APP_INITIALIZER or ngOnInit) */
  ping(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const healthUrl = `${environment.apiUrl}/actuator/health`;

    // After 3s without a response, assume the server is waking
    this.wakingTimer = setTimeout(() => {
      if (this.status() === 'idle') {
        this.status.set('waking');
      }
    }, 3_000);

    // Hard timeout: if still no response after 20s, flag error
    this.errorTimer = setTimeout(() => {
      if (this.status() !== 'ready') {
        this.status.set('error');
        this.clearTimers();
      }
    }, 20_000);

    this.http.get(healthUrl, { responseType: 'text' }).subscribe({
      next: () => {
        this.status.set('ready');
        this.clearTimers();
      },
      error: () => {
        // The error timer will handle the final state;
        // but if it already fired, do nothing
        if (this.status() !== 'error') {
          this.status.set('error');
        }
        this.clearTimers();
      },
    });
  }

  private clearTimers(): void {
    if (this.wakingTimer) { clearTimeout(this.wakingTimer); this.wakingTimer = null; }
    if (this.errorTimer)  { clearTimeout(this.errorTimer);  this.errorTimer  = null; }
  }
}
