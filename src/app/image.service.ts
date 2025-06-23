import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

export interface Image {
  id: number;
  img_name: string;
  img_url: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = 'http://localhost/coffee-php';

  constructor(private http: HttpClient) { }

  // Get all images
  getAllImages(): Observable<Image[]> {
    return this.http.get<Image[]>(`${this.apiUrl}/images.php`).pipe(
      tap(data => console.log('Images data received:', data)),
      catchError(error => {
        console.error('Error fetching images:', error);
        return of([]);
      })
    );
  }

  // Get image by name
  getImageByName(name: string): Observable<Image | null> {
    return this.http.get<Image[]>(`${this.apiUrl}/images.php?name=${name}`).pipe(
      map(images => images.length > 0 ? images[0] : null),
      catchError(error => {
        console.error(`Error fetching image with name ${name}:`, error);
        return of(null);
      })
    );
  }
}