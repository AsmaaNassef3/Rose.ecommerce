import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { PaymentService } from '../../core/services/payment/payment.service';
import { Allorders, Order } from '../../shared/interfaces/allorders/allorders';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-allorders',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './allorders.component.html',
  styleUrl: './allorders.component.scss'
})
export class AllordersComponent implements OnInit {
  private readonly paymentService = inject(PaymentService);

  ordersData: WritableSignal<Order[]> = signal([]);
  showDetails: WritableSignal<{ [key: string]: boolean }> = signal({});

  ngOnInit(): void {
    this.getAllUserOrders();
  }

  getAllUserOrders(): void {
    this.paymentService.getUserOrders().subscribe({
      next: (res: Allorders) => {
        this.ordersData.set(res.orders);
        const initialState: { [key: string]: boolean } = {};
        res.orders.forEach(o => initialState[o._id] = false);
        this.showDetails.set(initialState);
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.ordersData.set([]);
      }
    });
  }

  toggleDetails(orderId: string): void {
    this.showDetails.update(state => ({
      ...state,
      [orderId]: !state[orderId]
    }));
  }

  visibleItems(order: Order) {
    const isExpanded = this.showDetails()[order._id];
    return isExpanded ? order.orderItems : order.orderItems.slice(0, 2);
  }
}
