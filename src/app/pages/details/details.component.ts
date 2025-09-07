import { DatePipe, CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PestsellerService } from './../../core/services/pestseller/pestseller.service';
import { Component, inject, OnInit, signal, WritableSignal, computed } from '@angular/core';
import { Product } from '../../shared/interfaces/details/details';
import { ChartService } from '../../core/services/chart/chart.service';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService } from '../../core/services/translate/traslation.service';
import { TokenService } from '../../core/services/token/token.service';
import { NavComponent } from '../../layouts/components/nav/nav.component';

type ColorKey = 'black' | 'red' | 'blue';

@Component({
  selector: 'app-details',
  imports: [DatePipe, CommonModule, CurrencyPipe, TranslateModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {

  private readonly pestSellerService = inject(PestsellerService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly chartService = inject(ChartService);
  private readonly translationService = inject(TranslationService);
  private readonly tokenService = inject(TokenService);
  
  productDetail: WritableSignal<Product[]> = signal([]);
  selectedImageIndex: WritableSignal<number> = signal(0);
  isLoading: WritableSignal<boolean> = signal(false);

  // RTL Support
  isRTL = computed(() => this.translationService.isRTL());

  // Color image mapping
  colorImageMap: Record<ColorKey, string> = {
    black: '',
    red: '',
    blue: ''
  };

  ngOnInit(): void {
    this.loadProductDetails();
  }

  private loadProductDetails(): void {
    this.isLoading.set(true);
    
    this.activatedRoute.paramMap.subscribe({
      next: (p) => {
        let productId = p.get('id');
        this.pestSellerService.getSpecificProduct(productId!).subscribe({
          next: (res) => {
            this.productDetail.set([res.product]);

            // Build color map after data arrives
            this.colorImageMap = {
              black: res.product.imgCover,
              red: res.product.images[0] ?? '',
              blue: res.product.images[1] ?? ''
            };

            this.isLoading.set(false);
          },
          error: (err) => {
            console.log(err);
            this.isLoading.set(false);
          }
        });
      }
    });
  }

  // Color selection
  selectColor(color: ColorKey) {
    const imgUrl = this.colorImageMap[color];
    const product = this.productDetail()[0];
    if (!product) return;

    const imgIndex = product.images.indexOf(imgUrl);

    if (imgIndex >= 0) {
      this.selectImage(imgIndex);
    } else {
      this.selectImage(-1);
    }
  }

  // Image Gallery Methods
  selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }

  getCurrentImage(product: Product): string {
    const index = this.selectedImageIndex();
    if (index === -1) {
      return product.imgCover;
    }
    if (product.images && product.images.length > index) {
      return product.images[index];
    }
    return product.imgCover;
  }

  // Utility Methods
  getDiscountPercentage(product: Product): number {
    if (product.priceAfterDiscount && product.priceAfterDiscount < product.price) {
      return Math.round(((product.price - product.priceAfterDiscount) / product.price) * 100);
    }
    return 0;
  }

  getStockStatus(quantity: number): string {
    if (quantity === 0) return 'Out of Stock';
    if (quantity <= 10) return 'Limited Stock';
    return 'In Stock';
  }

  AddToCart(productId: string, quantity: number) {
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
        console.log('producttCart', res);
        this.chartService.cartNum.set(res.numOfCartItems);
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
      }
    });
  }
}
