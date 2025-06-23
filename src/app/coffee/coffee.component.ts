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
  selector: 'app-coffee',
  templateUrl: './coffee.component.html',
  styleUrls: ['./coffee.component.css'],
  standalone: false // This is not a standalone component, so we set it to false
})
export class CoffeeComponent implements OnInit {
  coffeeProducts: Product[] = [];
  
  constructor(private productService: ProductService) { }
  
  ngOnInit(): void {
    this.loadCoffeeProducts();
  }
  
  loadCoffeeProducts(): void {
    this.productService.getCoffeeProducts().subscribe((products: Product[]) => {
      this.coffeeProducts = products;
    });
  }
}