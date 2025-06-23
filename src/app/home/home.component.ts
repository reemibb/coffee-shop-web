import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../product.service';
import { ImageService, Image } from '../image.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false
})
export class HomeComponent implements OnInit, AfterViewInit {
  coffeeProducts: any[] = [];
  dessertProducts: any[] = [];
  testimonials: any[] = [];
  categoryImages: { [key: string]: string } = {};
  bannerImages: { [key: string]: string } = {};
  debugInfo: string = '';

  constructor(
    private productService: ProductService,
    private imageService: ImageService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Load products and testimonials
    this.productService.getSpecialCoffees().subscribe(data => {
      this.coffeeProducts = data;
      console.log('Coffee products loaded:', data);
    });

    this.productService.getSpecialDesserts().subscribe(data => {
      this.dessertProducts = data;
      console.log('Dessert products loaded:', data);
    });

    this.productService.getTestimonials().subscribe(data => {
      this.testimonials = data;
      console.log('Testimonials loaded:', data);
    });

    // Load images with detailed debugging
    console.log('About to call getAllImages()');
    this.imageService.getAllImages().subscribe(
      images => {
        console.log('IMAGES RECEIVED:', images);
        this.debugInfo = `Received ${images.length} images`;
        
        // Process the images and create a mapping for easy access
        images.forEach(image => {
          console.log(`Processing image: id=${image.id}, name=${image.img_name}, url=${image.img_url}`);
          
          if (image.img_name === 'barista') {
            console.log('Found barista image, setting as hero banner');
            this.bannerImages['hero'] = image.img_url;
          } else if (image.img_name === 'hot coffee') {
            this.categoryImages['hot_coffee'] = image.img_url;
          } else if (image.img_name === 'cold coffee') {
            this.categoryImages['cold_coffee'] = image.img_url;
          } else if (image.img_name === 'cup coffee') {
            this.categoryImages['cup_coffee'] = image.img_url;
          } else if (image.img_name === 'desserts') {
            this.categoryImages['desserts'] = image.img_url;
          }
        });
        
        console.log('After processing, bannerImages =', this.bannerImages);
        console.log('After processing, categoryImages =', this.categoryImages);
        
        // Check specifically for hero banner
        if (this.bannerImages['hero']) {
          console.log('Hero banner image URL set to:', this.bannerImages['hero']);
        } else {
          console.log('Hero banner image URL not set, will use default');
        }
      },
      error => {
        console.error('Error fetching images:', error);
        this.debugInfo = `Error: ${error.message || 'Unknown error'}`;
      }
    );
  }
  
  ngAfterViewInit(): void {
    // Test direct image access
    setTimeout(() => {
      console.log('Current hero image:', this.bannerImages['hero']);
      console.log('Current hero style:', this.getHeroBgImage());
    }, 2000);
  }

  // Helper methods to get image URLs safely
  getCategoryImage(name: string): string {
    const url = this.categoryImages[name] || 'assets/icons/' + name + '.svg';
    console.log(`Getting category image for ${name}: ${url}`);
    return url;
  }
  
  getHeroBgImage(): object {
    console.log('getHeroBgImage called, banner =', this.bannerImages['hero']);
    
    if (this.bannerImages['hero']) {
      const style = { 'background-image': `url('${this.bannerImages['hero']}')` };
      console.log('Returning hero bg style:', style);
      return style;
    }
    
    const defaultStyle = { 'background-image': 'url("/assets/images/hero-bg.jpg")' };
    console.log('Returning default hero bg style:', defaultStyle);
    return defaultStyle;
  }
  
  // For displaying debug info in the template if needed
  getDebugInfo(): string {
    return JSON.stringify({
      heroImage: this.bannerImages['hero'] || 'not set',
      categoryImages: Object.keys(this.categoryImages),
      debugInfo: this.debugInfo
    }, null, 2);
  }
  
  // Add this method to handle the "ORDER NOW" button click
  // Add this method to handle the "ORDER NOW" button click
onOrderNowClick(): void {
  // Check if user is logged in
  this.authService.isLoggedIn().subscribe(isLoggedIn => {
    if (isLoggedIn) {
      // User is logged in, navigate to the order page
      this.router.navigate(['/order']);
    } else {
      // Store the current URL to redirect back after login
      sessionStorage.setItem('returnUrl', '/order');
      // User is not logged in, redirect to login page
      this.router.navigate(['/login']);
    }
  });
}
  
}