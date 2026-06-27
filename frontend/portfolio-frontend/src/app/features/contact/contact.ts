import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  inject,
  PLATFORM_ID,
  ElementRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PortfolioService } from '../../core/services/portfolio.service';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly fb = inject(FormBuilder);
  private readonly portfolioService = inject(PortfolioService);
  private readonly hostEl = inject(ElementRef<HTMLElement>);

  readonly visible = signal(false);
  readonly submitting = signal(false);
  readonly submitted = signal(false);
  readonly success = signal(false);
  readonly errorMessage = signal('');

  readonly contactForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
  });

  private observer: IntersectionObserver | null = null;

  readonly EMAIL = 'shubhamkalwar14@gmail.com';
  readonly GITHUB = 'https://github.com/Shubham-Kalwar';
  readonly LINKEDIN = 'https://linkedin.com/in/shubham-kalwar';
  readonly LOCATION = 'Mumbai, India';

  ngOnInit(): void {
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
  }

  getError(field: string): string | null {
    const control = this.contactForm.get(field);
    if (!control || !control.touched || !control.errors) return null;

    if (control.errors['required']) return `// error: ${field} is required`;
    if (control.errors['email']) return '// error: invalid email';
    if (control.errors['minlength']) return `// error: minimum ${control.errors['minlength'].requiredLength} characters`;
    if (control.errors['maxlength']) return '// error: too long';
    return null;
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set('');

    this.portfolioService.sendContact(this.contactForm.value).subscribe({
      next: (res) => {
        this.submitting.set(false);
        this.submitted.set(true);
        this.success.set(res.success);
        if (!res.success) {
          this.errorMessage.set(res.message || 'delivery failed');
        }
      },
      error: () => {
        this.submitting.set(false);
        this.submitted.set(true);
        this.success.set(false);
        this.errorMessage.set('delivery failed -- email me directly');
      },
    });
  }
}
