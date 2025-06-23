import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';

// Define a Product interface to avoid the 'any' type warning
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

@Component({
  selector: 'app-bakery',
  templateUrl: './bakery.component.html',
  styleUrls: ['./bakery.component.css'],
  standalone: false // This is not a standalone component, so we set it to false
})
export class BakeryComponent implements OnInit {
  dessertProducts: Product[] = [];
  
  constructor(private productService: ProductService) { }
  
  ngOnInit(): void {
    this.loadDessertProducts();
  }
  
  loadDessertProducts(): void {
    this.productService.getDessertProducts().subscribe((products: Product[]) => {
      this.dessertProducts = products;
    });
  }
}