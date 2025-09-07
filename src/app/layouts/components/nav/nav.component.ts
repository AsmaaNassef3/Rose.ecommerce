import { Component, ViewChild, ElementRef, inject, computed, Signal, OnInit, signal, effect, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TokenService } from '../../../core/services/token/token.service';
import { AuthComponent } from "../../auth/auth.component";
import { ChartService } from '../../../core/services/chart/chart.service';
import { SearchService } from '../../../core/services/search/search.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { TranslationService } from '../../../core/services/translate/traslation.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, AuthComponent, CommonModule, TranslateModule],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {
  
  // Services
  private translationService = inject(TranslationService);
  private chartService = inject(ChartService);
  private searchService = inject(SearchService);
  public tokenService = inject(TokenService);
  private translate = inject(TranslateService);

  // ViewChild references
  @ViewChild('modal') modalRef!: ElementRef<HTMLDialogElement>;
  @ViewChild('searchInput') searchInputRef!: ElementRef<HTMLInputElement>;

  // Global Modal Control - Static Signal
  static globalLoginModalOpen = signal(false);
  static globalLoginModalRef: ElementRef<HTMLDialogElement> | null = null;

  // Signals
  selectedLang = this.translationService.currentLang;
  isRTL = this.translationService.isRTL;
  isMobileMenuOpen = signal(false);
  isSearchOpen = signal(false);
  cartCount: Signal<number> = computed(() => this.chartService.cartNum());

  // Computed signal for authentication state - this will react to currentUser changes
  isAuthenticated = computed(() => {
    const user = this.tokenService.currentUser();
    return Object.keys(user).length > 0 && !this.tokenService.isTokenExpired();
  });

  // Get languages from service
  languages = this.translationService.getLanguages();

  constructor() {
    // Effect to handle RTL/LTR changes
    effect(() => {
      const isRtl = this.isRTL();
      if (typeof document !== 'undefined') {
        document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
        document.documentElement.setAttribute('lang', this.selectedLang());
      }
    });

    // Effect to handle global modal changes
    effect(() => {
      if (NavComponent.globalLoginModalOpen()) {
        this.openModal();
      }
    });

    // Effect to handle authentication state changes
    effect(() => {
      const authenticated = this.isAuthenticated();
      console.log('Authentication state changed:', authenticated);
      
      if (authenticated) {
        // Load cart items when user logs in
        this.loadCartItems();
      } else {
        // Clear cart count when user logs out
        this.chartService.cartNum.set(0);
      }
    });
  }

  // Static method to trigger global modal
  static triggerGlobalLoginModal(): void {
    NavComponent.globalLoginModalOpen.set(true);
  }

  // Language methods
  changeLang(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const lang = selectElement.value;
    this.translationService.changeLang(lang);
    this.closeMobileMenu();
  }

  // Mobile menu methods
  toggleMobileMenu() {
    this.isMobileMenuOpen.set(!this.isMobileMenuOpen());
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }

  // Modal methods
  openModal() {
    if (this.modalRef?.nativeElement) {
      NavComponent.globalLoginModalRef = this.modalRef;
      this.modalRef.nativeElement.showModal();
      // Prevent body scrolling
      document.body.classList.add('overflow-hidden');
    }
  }

  closeModal() {
    if (this.modalRef?.nativeElement) {
      this.modalRef.nativeElement.close();
      // Restore body scrolling
      document.body.classList.remove('overflow-hidden');
    }
    NavComponent.globalLoginModalOpen.set(false);
  }

  // Optional: Close on backdrop click
  @HostListener('click', ['$event'])
  onBackdropClick(event: MouseEvent) {
    if (event.target === this.modalRef.nativeElement) {
      this.closeModal();
    }
  }

  // Search methods
  toggleSearch() {
    this.isSearchOpen.set(!this.isSearchOpen());
    
    if (this.isSearchOpen()) {
      setTimeout(() => {
        this.searchInputRef?.nativeElement?.focus();
      }, 100);
    }
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchService.searchTerm.set(value);
  }

  closeSearch() {
    this.isSearchOpen.set(false);
  }

  // Handle escape key for modals
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      if (this.isSearchOpen()) {
        this.closeSearch();
      }
      if (this.isMobileMenuOpen()) {
        this.closeMobileMenu();
      }
    }
  }

  // Load cart items
  private loadCartItems() {
    this.chartService.getLoggedUserCart().subscribe({
      next: (res) => {
        this.chartService.cartNum.set(res.numOfCartItems);
        console.log('Cart items loaded:', res.numOfCartItems);
      },
      error: (error) => {
        console.error('Error fetching cart items:', error);
        this.chartService.cartNum.set(0);
      }
    });
  }

  ngOnInit(): void {
    // Set static reference for global access
    NavComponent.globalLoginModalRef = this.modalRef;

    // Listen to keyboard events
    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', this.onKeyDown.bind(this));
    }

    // Check token expiration on init
    if (this.tokenService.getToken() && this.tokenService.isTokenExpired()) {
      console.log('Token expired, logging out');
      this.tokenService.clearToken();
    }
  }

  ngOnDestroy() {
    if (typeof document !== 'undefined') {
      document.removeEventListener('keydown', this.onKeyDown.bind(this));
    }
  }
}