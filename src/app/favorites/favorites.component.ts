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

  constructor(private favoriteService: FavoriteService) {}

  ngOnInit(): void {
    this.loadFavoriteProducts();
  }

  loadFavoriteProducts(): void {
    this.isLoading = true;
    this.favoriteService.getFavoriteProducts().subscribe(products => {
      this.favoriteProducts = products;
      this.isLoading = false;
    });
  }
}