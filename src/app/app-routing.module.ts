import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CoffeeComponent } from './coffee/coffee.component';
import { BakeryComponent } from './bakery/bakery.component';
import { LoginComponent } from './login/login.component';
import { AboutComponent } from './about/about.component';
import { ShopComponent } from './shop/shop.component';
import { FavoritesComponent } from './favorites/favorites.component';



const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'coffee', component: CoffeeComponent },
  { path: 'bakery', component: BakeryComponent },
  { path: 'login', component: LoginComponent },
  { path: 'about', component: AboutComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
