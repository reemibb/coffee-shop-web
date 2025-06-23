import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService, Order } from '../order.service';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css'],
  standalone: false
})
export class OrderConfirmationComponent implements OnInit {
  orderId: number | null = null;
  order: Order | null = null;
  isLoading = true;
  error = '';
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.orderId = +params['id'];
        this.loadOrderDetails();
      } else {
        this.error = 'Order ID not provided';
        this.isLoading = false;
      }
    });
  }
  
  loadOrderDetails(): void {
    if (!this.orderId) return;
    
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (order) => {
        this.order = order;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load order details';
        this.isLoading = false;
        console.error('Error loading order:', error);
      }
    });
  }
  
  continueShopping(): void {
    this.router.navigate(['/']);
  }
  
  viewOrderDetails(): void {
    if (this.orderId) {
      this.router.navigate(['/orders', this.orderId]);
    }
  }
}