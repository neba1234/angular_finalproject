import { Component, inject, input } from '@angular/core';
import { Medication } from '../types';
import { JsonPipe, NgClass } from '@angular/common';
import { MedicationService } from './medication.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-medication',
  standalone: true,
  imports: [NgClass, JsonPipe, RouterLink],
  template: `
    @if(is_loggedin){
    <div [ngClass]="{ 'medication-container': true }">
      <a
        [routerLink]="['', 'med_route', 'medication-detail']"
        [queryParams]="{
          medicationid: medication()?._id,
          med_image_id: medication()?.image?._id
        }"
      >
        <div class="medication-name">{{ medication()?.name }}</div></a
      >
      <div class="button-group">
        <button class="action-button delete" (click)="delete()">Delete</button>
        <button class="action-button update" (click)="update()">Update</button>
        <button class="action-button add-review" (click)="add_review()">
          Add Review
        </button>
        <button class="action-button add-review" (click)="review_list()">
          Review List
        </button>
      </div>
    </div>
    }@else {
    <div [ngClass]="{ 'medication-container': true }">
      <a
        [routerLink]="['', 'med_route', 'medication-detail']"
        [queryParams]="{
          medicationid: medication()?._id,
          med_image_id: medication()?.image?._id
        }"
      >
        <div class="medication-name">{{ medication()?.name }}</div></a
      >
    </div>

    }
  `,
  styles: [
    `
      .medication-container {
        border-radius: 10px;
        border: 1px solid #ccc;
        background-color: #f9f9f9;
        width: 75%;
        padding: 15px;
        margin: 10px auto;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .medication-name {
        font-size: 1.2em;
        font-weight: bold;
        margin-bottom: 10px;
      }

      .button-group {
        display: flex;
        gap: 10px;
      }

      .action-button {
        padding: 8px 16px;
        font-size: 0.9em;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s;
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
        opacity: 0.8;
      }
    `,
  ],
})
export class MedicationComponent {
  medication = input<Medication>();
  medications = inject(MedicationService).medications;
  http = inject(HttpClient);
  notification = inject(ToastrService);
  jwtid = inject(AuthService).state()._id;
  route = inject(Router);
  is_loggedin = inject(AuthService).is_logged_in();
  myid = this.medication()?._id;
  delete() {
    let medication_userid = this.medication()?.added_by?.user_id;
    if (medication_userid === this.jwtid) {
      this.http
        .delete<{ success: boolean; data: boolean }>(
          `http://localhost:3000/medications/${this.medication()?._id}`
        )
        .subscribe((res) => {
          if (res.success) {
            let filtered = this.medications().filter(
              (elem) => elem._id !== this.medication()?._id
            );
            this.medications.set(filtered);
            this.notification.success('deleted success');
          }
        });
    } else {
      this.notification.error('your not authorized to delete');
    }
  }

  update() {
    let updateid = this.medication()?._id;
    this.route.navigate(['', 'med_route', 'update', updateid], {
      queryParams: { id: this.medication()?._id },
    });
  }

  review_list() {
    this.route.navigate([
      '',
      'med_route',
      'medications',
      `${this.id}`,
      'review-list',
    ]);
  }

  add_review() {
    this.route.navigate(['', 'med_route', 'add-review'], {
      queryParams: { medicationid: this.medication()?._id },
    });
  }

  get id() {
    return this.medication()?._id;
  }
}
