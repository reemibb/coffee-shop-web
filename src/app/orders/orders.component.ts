import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService, Order } from '../order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  standalone: false,
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  isLoading = true;
  error = '';
  
  constructor(
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }
  
  loadOrders(): void {
    this.isLoading = true;
    this.error = '';
    
    this.orderService.getUserOrders().subscribe({
      next: (orders) => {
        console.log('Orders loaded successfully:', orders);
        this.orders = orders;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.error = 'Failed to load your orders. Please try again.';
        this.isLoading = false;
      }
    });
  }
  
  viewOrderDetails(orderId: number): void {
    this.router.navigate(['/orders', orderId]);
  }
  
  getStatusClass(status: string): string {
    if (!status) return 'bg-secondary';
    
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-warning';
      case 'processing': return 'bg-info';
      case 'shipped': return 'bg-primary';
      case 'delivered': return 'bg-success';
      case 'cancelled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
  
  continueShopping(): void {
    this.router.navigate(['/']);
  }
}