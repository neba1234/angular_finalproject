import { Component, effect, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Review } from '../types';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-reviewupdate',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
  ],
  template: `
    <mat-card>
      <form [formGroup]="form" (ngSubmit)="update_review()">
        <mat-form-field appearance="fill">
          <mat-label>Review</mat-label>
          <input
            matInput
            type="text"
            placeholder="Enter your review"
            formControlName="review"
          />
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Rating</mat-label>
          <input
            matInput
            type="number"
            placeholder="Enter your rating"
            formControlName="rating"
            min="0"
            max="10"
          />
        </mat-form-field>
        <button
          mat-raised-button
          color="primary"
          type="submit"
          [disabled]="form.invalid"
        >
          Update Review
        </button>
      </form>
    </mat-card>
  `,
  styles: [
    `
      mat-card {
        max-width: 800px;
        margin: 20px auto;
        padding: 20px;
        margin-top: 80px;
      }
      mat-form-field {
        width: 100%;
        margin-bottom: 16px;
      }
      button {
        width: 100%;
      }
    `,
  ],
})
export class ReviewupdateComponent {
  http = inject(HttpClient);
  med_id = input();
  review_id = input();
  navigation = inject(Router);
  notification = inject(ToastrService);
  form = inject(FormBuilder).group({
    review: ['', [Validators.required]],
    rating: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
  });

  update_review() {
    this.http
      .put<{ success: boolean; data: boolean }>(
        environment.BACKEND_SERVER +
          `/medications/${this.med_id()}/reviews/${this.review_id()}`,
        this.form.value
      )
      .subscribe((res) => {
        if (res.success) {
          this.notification.success('Successfully updated');
          this.navigation.navigate([
            '',
            'med_route',
            'medications',
            `${this.med_id()}`,
            'review-list',
          ]);
        } else {
          this.notification.error('Something went wrong');
        }
      });
  }

  constructor() {
    effect(() => {
      this.http
        .get<{ success: boolean; data: Review }>(
          environment.BACKEND_SERVER +
            `/medications/${this.med_id()}/reviews/${this.review_id()}`
        )
        .subscribe((res) => {
          if (res.success) {
            this.form.patchValue(res.data);
          }
        });
    });
  }
}
