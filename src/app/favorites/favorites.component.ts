import { Component, OnInit } from '@angular/core';
import { FavoriteService } from '../favorite.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
  standalone: false
})
export class FavoritesComponent implements OnInit {
  favoriteProducts: any[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private favoriteService: FavoriteService) {}

  ngOnInit(): void {
    this.loadFavoriteProducts();
  }

  loadFavoriteProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.favoriteService.getFavoriteProducts().subscribe(
      products => {
        this.favoriteProducts = products;
        this.isLoading = false;
        console.log('Favorite products loaded:', products);
        
        // Debug any products with missing images
        const productsWithoutImages = products.filter(p => !p.imageUrl);
        if (productsWithoutImages.length > 0) {
          console.warn('Some products are missing imageUrl:', productsWithoutImages);
        }
      },
      error => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load favorite products';
        console.error('Error loading favorites:', error);
      }
    );
  }
}