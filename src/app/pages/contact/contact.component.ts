import { Component, computed, inject, OnInit, OnDestroy } from '@angular/core';
import { ContactService } from '../../core/services/contact/contact.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../core/services/translate/traslation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, OnDestroy {
  private readonly contactService = inject(ContactService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly translationService = inject(TranslationService);
  private readonly translateService = inject(TranslateService); // Add this
  
  private subscriptions = new Subscription();

  // Make sure isRTL is properly computed
  isRTL = computed(() => this.translationService.isRTL());

  contactForm: FormGroup = this.formBuilder.group({
    name: [null, [Validators.required]],
    email: [null, [Validators.required, Validators.email]],
    subject: [null, [Validators.required]],
    message: [null, [Validators.required]],
    phone: [null, [Validators.required]],
  });

  ngOnInit(): void {
    // Ensure translations are loaded
    this.subscriptions.add(
      this.translateService.onLangChange.subscribe(() => {
        console.log('Language changed in contact component');
      })
    );

    // Force initial translation check
    if (this.translateService.currentLang) {
      this.translateService.use(this.translateService.currentLang);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  hasError(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  contactSubmit(): void {
    if (this.contactForm.valid) {
      this.contactService.submitContactForm(this.contactForm.value).subscribe({
        next: (res) => {
          console.log('Contact form submitted successfully:', res);
        },
        error: (err) => {
          console.error('Error submitting contact form:', err);
        }
      });
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
}
