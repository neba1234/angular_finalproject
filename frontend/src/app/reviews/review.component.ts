import { Component, inject, input } from '@angular/core';
import { Review } from '../types';
import { DatePipe, JsonPipe, NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { ReviewService } from './review.service';
@Component({
  selector: 'app-review',
  standalone: true,
  imports: [NgClass, RouterLink, JsonPipe, DatePipe],
  template: `
    @if(is_loggedin){

    <div [ngClass]="{ 'medication-container': true, grey: odd() }">
      <div class="medication-name">
        <p>{{ review()?.review }}</p>
        <p>rating:{{ review()?.rating }}/10</p>
        <p>reviewed by:{{ review()?.by?.fullname }}</p>
        <p>{{ review()?.date | date : 'medium' }}</p>
      </div>

      <div class="button-group">
        <button class="action-button delete" (click)="delete()">Delete</button>
        <button class="action-button update" (click)="update()">Update</button>
        <button (click)="go_to_medicine_list()">Go to medicine-list</button>
      </div>
    </div>

    } @else {

    <div [ngClass]="{ 'medication-container': true, grey: odd() }">
      <div class="medication-name">
        <p>{{ review()?.review }}</p>
        <p>{{ review()?.rating }}</p>
        <p>{{ review()?.by?.fullname }}</p>
        <p>{{ review()?.date | date }}</p>
      </div>
    </div>

    }
  `,
  styles: [
    `
      .medication-container {
        border-radius: 10px;
        border: 1px solid #ddd;
        background-color: #fff;
        width: 60%;
        padding: 20px;
        margin: 15px auto;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transition: box-shadow 0.3s ease-in-out;
      }

      .medication-container:hover {
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      }

      .medication-name {
        font-size: 0.8em;
        font-weight: 600;
        margin-bottom: 12px;
        color: #333;
      }

      .medication-name p {
        margin: 0;
        padding: 4px 0;
      }

      .button-group {
        display: flex;
        gap: 12px;
        margin-top: 10px;
      }

      .action-button {
        padding: 10px 20px;
        font-size: 0.95em;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s, transform 0.3s;
      }

      .action-button.delete {
        background-color: #e74c3c;
        color: white;
      }

      .action-button.update {
        background-color: #3498db;
        color: white;
      }

      .action-button.add-review {
        background-color: #2ecc71;
        color: white;
      }

      .action-button:hover {
        opacity: 0.85;
        transform: translateY(-2px);
      }

      .grey {
        background-color: grey;
      }
    `,
  ],
})
export class ReviewComponent {
  state = inject(AuthService);
  review = input<Review>();
  odd = input<boolean>();
  reviews = inject(ReviewService).reviews;
  med_id = input<string>();
  navigation = inject(Router);
  http = inject(HttpClient);
  notification = inject(ToastrService);
  is_loggedin = inject(AuthService).is_logged_in();

  get review_id() {
    return this.review()?._id;
  }

  update() {
    if (this.state.state()._id === this.review()?.by?.user_id) {
      this.navigation.navigate([
        '',
        'med_route',
        'medications',
        `${this.med_id()}`,
        'review-list',
        this.review_id,
      ]);
    } else {
      this.notification.error('you are not authorized to update others review');
      return;
    }
  }

  go_to_medicine_list() {
    this.navigation.navigate(['', 'med_route', 'medication-list']);
  }

  delete() {
    this.http
      .delete<{ success: boolean; data: boolean }>(
        environment.BACKEND_SERVER +
          `/medications/${this.med_id()}/reviews/${this.review_id}`
      )
      .subscribe((res) => {
        if (
          res.success &&
          this.state.state()._id === this.review()?.by?.user_id
        ) {
          let filtered = this.reviews().filter(
            (elem) => elem._id !== this.review_id
          );
          this.reviews.set(filtered);
          this.navigation.navigate([
            '',
            'med_route',
            'medications',
            `${this.med_id()}`,
            'review-list',
          ]);
          this.notification.success('deleted successfully');
        } else {
          this.notification.error('something went wrong');
        }
      });
  }
}
