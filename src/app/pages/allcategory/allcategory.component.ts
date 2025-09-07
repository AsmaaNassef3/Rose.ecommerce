import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  selectAllProducts,
  selectIsLoading,
  selectCurrentPage,
  selectTotalPages,
  selectSearchTerm
} from '../../store/products/product.selector';
import { loadProducts, updateSearchTerm } from '../../store/products/products.actions';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { take } from 'rxjs/operators';
import { TranslationService } from '../../core/services/translate/traslation.service';
import { TranslateModule } from '@ngx-translate/core';
import { TokenService } from '../../core/services/token/token.service';
import { NavComponent } from '../../layouts/components/nav/nav.component';
import { ChartService } from '../../core/services/chart/chart.service';

@Component({
  selector: 'app-allcategory',
  standalone: true,
  imports: [CommonModule, SidebarComponent, CurrencyPipe, TranslateModule, RouterLink],
  templateUrl: './allcategory.component.html',
  styleUrls: ['./allcategory.component.scss']
})
export class AllcategoryComponent implements OnInit {
  private store = inject(Store);
  private translationService = inject(TranslationService);
  private tokenService = inject(TokenService);
  private chartService = inject(ChartService);

  products$ = this.store.select(selectAllProducts);
  isLoading$ = this.store.select(selectIsLoading);
  currentPage$ = this.store.select(selectCurrentPage);
  totalPages$ = this.store.select(selectTotalPages);
  searchTerm$ = this.store.select(selectSearchTerm);

  isRTL = computed(() => this.translationService.isRTL());

  ngOnInit(): void {
    this.searchTerm$.pipe(take(1)).subscribe(search => {
      this.store.dispatch(loadProducts({ page: 1 }));
    });
  }

  changePage(page: number): void {
    if (page < 1) return;

    this.totalPages$.pipe(take(1)).subscribe(total => {
      if (page <= total) {
        this.searchTerm$.pipe(take(1)).subscribe(search => {
          if (search && search.trim() !== '') {
            this.store.dispatch(updateSearchTerm({ searchTerm: search, page }));
          } else {
            this.store.dispatch(loadProducts({ page }));
          }
        });
      }
    });
  }

  getArray(totalPages: number | null): number[] {
    if (!totalPages) return [];
    const limit = Math.min(totalPages, 10);
    return Array.from({ length: limit }, (_, i) => i + 1);
  }

  // Add to Cart with Authentication Check
  AddToCart(productId: string, quantity: number = 1, event?: Event) {
    // Prevent event bubbling if called from button inside card
    if (event) {
      event.stopPropagation();
    }

    // Check authentication first
    if (!this.tokenService.isAuthenticated()) {
      NavComponent.triggerGlobalLoginModal();
      return;
    }

    const data = {
      product: productId,
      quantity: quantity
    };

    this.chartService.addProductToChart(data).subscribe({
      next: (res) => {
        console.log('Product added to cart', res);
        this.chartService.cartNum.set(res.numOfCartItems);
        // You can add a toast notification here
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
      }
    });
  }

  // Add to Wishlist functionality
  addToWishlist(productId: string, event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    // Check authentication first
    if (!this.tokenService.isAuthenticated()) {
      NavComponent.triggerGlobalLoginModal();
      return;
    }

    // Implement wishlist functionality here
    console.log('Add to wishlist:', productId);
  }
}
