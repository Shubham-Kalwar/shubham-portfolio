import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'app-boot-sequence',
  imports: [],
  templateUrl: './boot-sequence.html',
  styleUrl: './boot-sequence.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BootSequence implements OnInit, OnDestroy {
  private static readonly LINES = [
    '$ initializing portfolio...',
    '$ loading modules: angular, spring-boot, postgresql',
    '$ compiling assets... done',
    '$ welcome',
  ];

  /** Whether the boot overlay should be visible at all */
  readonly visible = signal(true);

  /** Whether the fade-out animation has started */
  readonly fadingOut = signal(false);

  /** How many lines have been fully revealed (0..4) */
  readonly revealedCount = signal(0);

  /** The slice of lines currently visible */
  readonly lines = computed(() =>
    BootSequence.LINES.slice(0, this.revealedCount())
  );

  /** Index of the line currently being typed (for cursor placement) */
  readonly typingIndex = computed(() => {
    const count = this.revealedCount();
    return count < BootSequence.LINES.length ? count : -1;
  });

  private timeoutIds: ReturnType<typeof setTimeout>[] = [];

  ngOnInit(): void {
    // If already shown this session, skip entirely
    if (typeof sessionStorage !== 'undefined') {
      if (sessionStorage.getItem('boot-done') === '1') {
        this.visible.set(false);
        return;
      }
    }

    this.startSequence();
  }

  ngOnDestroy(): void {
    this.timeoutIds.forEach((id) => clearTimeout(id));
  }

  skip(): void {
    this.timeoutIds.forEach((id) => clearTimeout(id));
    this.timeoutIds = [];
    this.dismiss();
  }

  private startSequence(): void {
    const lineDelay = 350; // ms between lines
    const totalLines = BootSequence.LINES.length;

    for (let i = 0; i < totalLines; i++) {
      const id = setTimeout(() => {
        this.revealedCount.set(i + 1);
      }, lineDelay * (i + 1));
      this.timeoutIds.push(id);
    }

    // After last line, wait a beat then fade out
    const dismissDelay = lineDelay * totalLines + 400;
    const dismissId = setTimeout(() => this.dismiss(), dismissDelay);
    this.timeoutIds.push(dismissId);
  }

  private dismiss(): void {
    this.fadingOut.set(true);

    // Mark session so we don't show again
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('boot-done', '1');
    }

    // Remove from DOM after fade animation completes
    const removeId = setTimeout(() => {
      this.visible.set(false);
    }, 400);
    this.timeoutIds.push(removeId);
  }
}
