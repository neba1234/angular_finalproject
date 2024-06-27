import { HttpClient } from '@angular/common/http';
import { Component, effect, inject, input } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Review } from '../types';
import { MedicationService } from '../medicationlist/medication.service';
import { ReviewComponent } from './review.component';
import { JsonPipe } from '@angular/common';
import { ReviewService } from './review.service';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [ReviewComponent, JsonPipe, RouterLink],
  template: `
    @for(review of reviews();track review._id;let odd=$odd){
    <app-review [review]="review" [med_id]="id()" [odd]="odd" />
    }@empty {
    <div>
      <h1>no reviews added yet!</h1>
    </div>
    }
  `,
  styles: ``,
})
export class ReviewsComponent {
  id = input<string>();
  http = inject(HttpClient);
  medications = inject(MedicationService).medications();
  reviews = inject(ReviewService).reviews;
  jwt = inject(AuthService).state().jwt;
  navigation = inject(Router);

  constructor() {
    effect(() => {
      return this.http
        .get<{ success: boolean; data: Review[] }>(
          environment.BACKEND_SERVER + `/medications/${this.id()}/reviews`
        )
        .subscribe((res) => {
          if (res.success) {
            this.reviews.set(res.data);
          }
        });
    });
  }
}
