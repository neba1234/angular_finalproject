import { Injectable, effect, inject, signal } from '@angular/core';
import { Review } from '../types';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  reviews=signal<Review[]>([])
  http=inject(HttpClient)
  

  constructor(){
    effect(()=>{

      this.reviews()

    })
  }
}
