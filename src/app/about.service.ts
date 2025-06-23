import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AboutContent {
  title: string;
  paragraphs: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AboutService {
  private apiUrl = 'http://localhost/coffee-php/about.php'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) { }

  getAboutContent(): Observable<AboutContent> {
    return this.http.get<AboutContent>(this.apiUrl);
  }
}