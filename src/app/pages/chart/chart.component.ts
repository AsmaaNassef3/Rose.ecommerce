import { Component, inject, OnInit, signal, WritableSignal, computed } from '@angular/core';
import { ChartService } from '../../core/services/chart/chart.service';
import { Observable } from 'rxjs';
import { CartItem, Cartitems, Product } from '../../shared/interfaces/cart/cartitems';
import { RouterLink } from '@angular/router';
import { Cart, Totalcart } from '../../shared/interfaces/cart/totalcart';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService } from '../../core/services/translate/traslation.service';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [RouterLink, CommonModule, TranslateModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent implements OnInit {
  private readonly chartService = inject(ChartService);
  private readonly translationService = inject(TranslationService);
  
  cartItems: WritableSignal<CartItem[]> = signal([]);
  totalCartItems: WritableSignal<number | null> = signal(null);
  
  // Add RTL support
  isRTL = computed(() => this.translationService.isRTL());

  getPopularItems() {
    this.chartService.getLoggedUserCart().subscribe({
      next: (res) => {
        console.log("cart items", res.message);
        this.cartItems.set(res.cart.cartItems);
        console.log("cart items", this.cartItems());
        this.totalCartItems.set(res.cart.totalPrice);
        console.log("Total cart items:", this.totalCartItems());
      },
      error: (error) => {
        console.error('Error fetching cart items:', error);
      }
    });
  }

  removeProductFromCart(productId: string): void {
    this.chartService.removeProductFromCart(productId).subscribe({
      next: (res) => {
        console.log(`Product with ID ${productId} removed from cart`);
        this.cartItems.set(res.cart.cartItems)
        console.log("jjjjjjjj",res)
        this.chartService.cartNum.set(res.numOfCartItems);
        console.log("kkkkk",this.chartService.cartNum());
      },
      error: (error) => {
        console.error(`Error removing product with ID ${productId} from cart:`, error);
      }
    });
  }

  clearUserCart(): void {
    this.chartService.clearUserCart().subscribe({
      next: (res) => {
        console.log('Cart cleared successfully');
        this.cartItems.set([]);
        this.chartService.cartNum.set(0);
      },
      error: (error) => {
        console.error('Error clearing cart:', error);
      }
    });
  }

  updateProductQuantity(productId: string, quantity: number): void {
    this.chartService.updateCartItemQuantity(productId, quantity).subscribe({
      next: (res) => {
        console.log(`Product with ID ${productId} updated to quantity ${quantity}`);
        console.log("Updated cart items:", res);
        
        this.cartItems.set(res.cart.cartItems);
        console.log("update",res)
        this.chartService.cartNum.set(res.numOfCartItems);
        console.log("kkkkk",this.chartService.cartNum());
        this.totalCartItems.set(res.cart.totalPrice);
      },
      error: (error) => {
        console.error(`Error updating product with ID ${productId} to quantity ${quantity}:`, error);
      }
    });
  }

  ngOnInit(): void {
    this.getPopularItems();
  }
}
