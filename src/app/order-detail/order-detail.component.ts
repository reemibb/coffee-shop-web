import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService, Order } from '../order.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css'],
  standalone: false,
})
export class OrderDetailComponent implements OnInit {
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
    
    this.isLoading = true;
    this.error = '';
    
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (order) => {
        console.log('Order loaded successfully:', order);
        this.order = order;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading order details:', err);
        this.error = 'Failed to load order details. Please try again.';
        this.isLoading = false;
      }
    });
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
  
  backToOrders(): void {
    this.router.navigate(['/orders']);
  }
}