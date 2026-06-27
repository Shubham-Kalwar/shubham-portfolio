import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  computed,
  ChangeDetectionStrategy,
  PLATFORM_ID,
  inject,
  ElementRef,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { NavigationIntentService } from '../../core/services/navigation-intent.service';

interface PaletteCommand {
  label: string;
  category: string;
  action: () => void;
}

@Component({
  selector: 'app-command-palette',
  imports: [],
  templateUrl: './command-palette.html',
  styleUrl: './command-palette.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandPalette implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly navIntent = inject(NavigationIntentService);

  /** Whether we're on macOS (for displaying ⌘ vs Ctrl) */
  readonly isMac = signal(false);

  /** The modifier key label for display */
  readonly modLabel = computed(() => (this.isMac() ? '⌘' : 'Ctrl'));

  /** Whether the palette modal is open */
  readonly isOpen = signal(false);

  /** Current search query */
  readonly query = signal('');

  /** Currently selected index in the filtered list */
  readonly selectedIndex = signal(0);

  /** Reference to the search input for autofocus */
  readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  private readonly GITHUB_URL = 'https://github.com/Shubham-Kalwar';
  private readonly LINKEDIN_URL = 'https://linkedin.com/in/shubham-kalwar';
  private readonly RESUME_URL = '/assets/resume.pdf';

  /** All available commands */
  readonly commands: PaletteCommand[] = [
    { label: 'Go to Home',          category: 'Navigation', action: () => this.smartScrollTo('home') },
    { label: 'Go to About',         category: 'Navigation', action: () => this.smartScrollTo('about') },
    { label: 'Go to Projects',      category: 'Navigation', action: () => this.router.navigateByUrl('/projects') },
    { label: 'Go to Experience',    category: 'Navigation', action: () => this.smartScrollTo('experience') },
    { label: 'Go to Contact',       category: 'Navigation', action: () => this.smartScrollTo('contact') },
    { label: 'Go to Certifications', category: 'Navigation', action: () => this.router.navigateByUrl('/certifications') },
    { label: 'Open GitHub',         category: 'External',   action: () => window.open(this.GITHUB_URL, '_blank') },
    { label: 'Open LinkedIn',       category: 'External',   action: () => window.open(this.LINKEDIN_URL, '_blank') },
    { label: 'Download Resume',     category: 'Action',     action: () => this.downloadResume() },
  ];

  /** Filtered commands based on search query */
  readonly filtered = computed(() => {
    const q = this.query().toLowerCase().trim();
    if (!q) return this.commands;
    return this.commands.filter((cmd) =>
      cmd.label.toLowerCase().includes(q)
    );
  });

  private boundKeydown: ((e: KeyboardEvent) => void) | null = null;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Detect macOS
    this.isMac.set(/Mac|iPhone|iPad|iPod/.test(navigator.platform));

    this.boundKeydown = (e: KeyboardEvent) => this.handleGlobalKeydown(e);
    document.addEventListener('keydown', this.boundKeydown);
  }

  ngOnDestroy(): void {
    if (this.boundKeydown) {
      document.removeEventListener('keydown', this.boundKeydown);
    }
  }

  open(): void {
    this.isOpen.set(true);
    this.query.set('');
    this.selectedIndex.set(0);

    // Focus the input after Angular renders
    setTimeout(() => {
      this.searchInput()?.nativeElement.focus();
    }, 0);
  }

  close(): void {
    this.isOpen.set(false);
  }

  onQueryChange(value: string): void {
    this.query.set(value);
    this.selectedIndex.set(0);
  }

  onInputKeydown(e: KeyboardEvent): void {
    const items = this.filtered();

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.selectedIndex.set(
          Math.min(this.selectedIndex() + 1, items.length - 1)
        );
        this.scrollSelectedIntoView();
        break;

      case 'ArrowUp':
        e.preventDefault();
        this.selectedIndex.set(Math.max(this.selectedIndex() - 1, 0));
        this.scrollSelectedIntoView();
        break;

      case 'Enter':
        e.preventDefault();
        if (items.length > 0) {
          this.executeCommand(items[this.selectedIndex()]);
        }
        break;

      case 'Escape':
        e.preventDefault();
        this.close();
        break;
    }
  }

  executeCommand(cmd: PaletteCommand): void {
    this.close();
    // Small delay to let the modal close before executing
    setTimeout(() => cmd.action(), 50);
  }

  onBackdropClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('palette-backdrop')) {
      this.close();
    }
  }

  selectItem(index: number): void {
    this.selectedIndex.set(index);
  }

  private handleGlobalKeydown(e: KeyboardEvent): void {
    const modifier = this.isMac() ? e.metaKey : e.ctrlKey;
    if (modifier && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      e.stopPropagation();
      if (this.isOpen()) {
        this.close();
      } else {
        this.open();
      }
    }
  }

  /**
   * Smart scroll: if on '/', scroll directly.
   * If on another route, queue a pending scroll and navigate home.
   */
  private smartScrollTo(sectionId: string): void {
    if (this.router.url === '/') {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      this.navIntent.setPendingScroll(sectionId);
      this.router.navigateByUrl('/');
    }
  }

  private downloadResume(): void {
    const a = document.createElement('a');
    a.href = this.RESUME_URL;
    a.download = 'Shubham_Kalwar_Resume.pdf';
    a.click();
  }

  private scrollSelectedIntoView(): void {
    setTimeout(() => {
      const el = document.querySelector('.palette-item.selected');
      if (el) {
        el.scrollIntoView({ block: 'nearest' });
      }
    }, 0);
  }
}
