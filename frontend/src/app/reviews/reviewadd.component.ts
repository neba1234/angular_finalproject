import { HttpClient } from '@angular/common/http';
import { Component, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { MedicationService } from '../medicationlist/medication.service';
import { Review } from '../types';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-reviewadd',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
  template: `
    <mat-card>
      <form [formGroup]="form" (ngSubmit)="add_review()">
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
          />
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Date</mat-label>
          <input matInput type="text" formControlName="date" readonly />
        </mat-form-field>
        <button
          mat-raised-button
          color="primary"
          type="submit"
          [disabled]="form.invalid"
        >
          Add Review
        </button>
      </form>
    </mat-card>
  `,
  styles: [
    `
      mat-card {
        max-width: 800px;
        margin: auto;
        padding: 20px;
        margin-top: 60px;
      }
      mat-form-field {
        width: 100%;
        margin-bottom: 20px;
        justify-content: center;
      }
      button {
        display: block;
        width: 100%;
      }
    `,
  ],
})
export class ReviewaddComponent {
  medicationid = input();
  http = inject(HttpClient);
  notification = inject(ToastrService);
  date = new Date();
  navigation = inject(Router);
  medications = inject(MedicationService).medications;
  form = inject(FormBuilder).group({
    review: ['', [Validators.required]],
    rating: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
    date: this.date.toLocaleString(),
  });
  add_review() {
    this.http
      .post<{ success: boolean; data: string }>(
        environment.BACKEND_SERVER +
          `/medications/${this.medicationid()}/reviews`,
        this.form.value
      )
      .subscribe((res) => {
        if (res.success) {
          let specific_medication = this.medications().find(
            (med) => med._id === this.medicationid()
          );
          if (specific_medication) {
            this.notification.success('Review added successfully');
            specific_medication.reviews?.push(this.form.value as Review);
            this.navigation.navigate(['', 'med_route', 'medication-list']);
          }
        }
      });
  }
}
