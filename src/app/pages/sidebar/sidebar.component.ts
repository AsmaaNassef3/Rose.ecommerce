import { Component, OnInit, Inject, PLATFORM_ID, inject } from '@angular/core';
import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { Drawer } from 'flowbite';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as ProductsActions from '../../store/products/products.actions';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { selectSelectedCategories, selectPriceRange } from '../../store/products/product.selector';
import { TranslationService } from '../../core/services/translate/traslation.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [ReactiveFormsModule, CurrencyPipe, TranslateModule],
})
export class SidebarComponent implements OnInit {
  private drawer!: Drawer;
  private isBrowser: boolean;
  searchForm!: FormGroup;
  priceForm!: FormGroup;
  private isOpen = false;

  categories: any[] = [];
  categoriesSelected: string[] = [];
  private readonly translateService = inject(TranslationService);
  private categoriesService = inject(CategoriesService);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder,
    private store: Store
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // Init sidebar drawer
    if (this.isBrowser) {
      const sidebarEl = document.getElementById('logo-sidebar');
      const backdropEl = document.getElementById('sidebar-backdrop');
      
      if (sidebarEl) {
        this.initializeDrawer(sidebarEl, backdropEl);
      }
    }

    // Search Form
    this.searchForm = this.fb.group({
      search: [''],
    });

    // Price Filter Form
    this.priceForm = this.fb.group({
      max: new FormControl(100),
    });

    // Dispatch search term
    this.searchForm
      .get('search')
      ?.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((term: string) => {
        this.store.dispatch(
          ProductsActions.updateSearchTerm({ searchTerm: term })
        );
      });

    // Dispatch price range (convert from $ to EGP)
    const USD_TO_EGP = 31;
    this.priceForm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(({ max }) => {
        const maxInEGP = max ? Math.round(max * USD_TO_EGP) : null;
        this.store.dispatch(
          ProductsActions.updatePriceRange({ min: 0, max: maxInEGP })
        );
      });

    // Load categories
    this.categoriesService.getCategoriesWithProductCount().subscribe({
      next: (res) => {
        this.categories = res.categoryProductCount;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      },
    });

    // Get selected categories from store
    this.store.select(selectSelectedCategories).subscribe((selected) => {
      this.categoriesSelected = selected;
    });
  }

  private initializeDrawer(sidebarEl: HTMLElement, backdropEl: HTMLElement | null): void {
    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024 && this.isOpen) {
        this.closeSidebar(sidebarEl, backdropEl);
      }
    });
  }

  handleCategoryChange(event: Event, categoryId: string): void {
    const input = event.target as HTMLInputElement;
    const checked = input?.checked ?? false;
    this.onCategoryToggle(categoryId, checked);
  }

  toggleSidebar(): void {
    if (!this.isBrowser) return;

    const sidebarEl = document.getElementById('logo-sidebar');
    const backdropEl = document.getElementById('sidebar-backdrop');

    if (!sidebarEl || !backdropEl) return;

    if (this.isOpen) {
      this.closeSidebar(sidebarEl, backdropEl);
    } else {
      this.openSidebar(sidebarEl, backdropEl);
    }
  }

  private openSidebar(sidebarEl: HTMLElement, backdropEl: HTMLElement): void {
    sidebarEl.classList.remove('-translate-x-full');
    backdropEl.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    this.isOpen = true;
  }

  private closeSidebar(sidebarEl: HTMLElement, backdropEl: HTMLElement | null): void {
    sidebarEl.classList.add('-translate-x-full');
    if (backdropEl) {
      backdropEl.classList.add('hidden');
    }
    document.body.style.overflow = '';
    this.isOpen = false;
  }

  onCategoryToggle(categoryId: string, checked: boolean): void {
    const updated = checked
      ? [...this.categoriesSelected, categoryId]
      : this.categoriesSelected.filter((id) => id !== categoryId);

    this.store.dispatch(
      ProductsActions.updateSelectedCategories({ categories: updated })
    );
  }
}