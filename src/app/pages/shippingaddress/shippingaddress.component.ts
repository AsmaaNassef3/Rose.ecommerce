import { Component, inject, OnInit, signal, WritableSignal, computed } from '@angular/core';
import { Address } from './../../shared/interfaces/Addresses/addresses';
import { AddressesService } from './../../core/services/Addresses/addresses.service';
import { PaymentService } from '../../core/services/payment/payment.service';
import { ChartService } from '../../core/services/chart/chart.service';
import { ModalComponent } from "../../shared/ui/modal/modal.component";
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService } from '../../core/services/translate/traslation.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shippingaddress',
  imports: [ModalComponent, TranslateModule, CommonModule],
  templateUrl: './shippingaddress.component.html',
  styleUrl: './shippingaddress.component.scss'
})
export class ShippingaddressComponent implements OnInit {
  private readonly chartService = inject(ChartService);
  private readonly paymentService = inject(PaymentService);
  private readonly addressesService = inject(AddressesService);
  private readonly router = inject(Router);
  private readonly translationService = inject(TranslationService);
  
  totalCartItems: WritableSignal<number | null> = signal(null);
  totalUserAddresses: WritableSignal<Address[] | null> = signal([]);
  step = signal(1);
  selectedAddress: any = null;
  
  // Add RTL support
  isRTL = computed(() => this.translationService.isRTL());

  loadUserAddresses(): void {
    this.addressesService.getLogedInUserAddress().subscribe({
      next: (res) => {
        this.totalUserAddresses.set(res.addresses);
      },
      error: () => {
        this.totalUserAddresses.set([]);
      }
    });
  }

  removeAddress(addressId: string): void {
    this.addressesService.removeAddress(addressId).subscribe({
      next: () => {
        this.loadUserAddresses();
      },
      error: () => {
        alert('Error removing address. Please try again.');
      }
    });
  }

  getPopularItems(): void {
    this.chartService.getLoggedUserCart().subscribe({
      next: (res) => {
        this.totalCartItems.set(res.cart.totalPrice);
      }
    });
  }

  selectAddress(address: any) {
    this.selectedAddress = address;
    console.log("Selected address:", this.selectedAddress);
  }

  cashOrder(): void {
    if (!this.selectedAddress) {
      alert("من فضلك اختر عنوان قبل الدفع");
      return;
    }
    
    const orderData = {
      shippingAddress: {
        street: this.selectedAddress.street,
        phone: this.selectedAddress.phone,
        city: this.selectedAddress.city,
        lat: this.selectedAddress.lat,
        long: this.selectedAddress.long
      }
    };

    this.paymentService.createCashOrder(orderData).subscribe({
      next: (res) => {
        console.log('الله ينور يا هندسة', res);
        setTimeout(() => {
          this.router.navigate(['/allOrders']);
        }, 200);
      },
      error: (error) => {
        console.error('Error creating cash order:', error);
      }
    });

    console.log("API call has been sent...");
  }
  
  checkOutOrder(): void {
    if (!this.selectedAddress) {
      alert("من فضلك اختر عنوان قبل الدفع");
      return;
    }
    
    const orderData = {
      shippingAddress: {
        street: this.selectedAddress.street,
        phone: this.selectedAddress.phone,
        city: this.selectedAddress.city,
        lat: this.selectedAddress.lat,
        long: this.selectedAddress.long
      }
    };

    this.paymentService.checkoutOrder(orderData).subscribe({
      next: (res) => {
        console.log("ميه ميه", res);
        window.open(res.session.url, '_blank');
      },
      error: (error) => {
        console.error('Error creating cash order:', error);
      }
    });

    console.log("API call has been sent...");
  }
  
  ngOnInit(): void {
    this.loadUserAddresses();
    this.getPopularItems();
  }
}
