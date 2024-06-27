import { Component, inject, input } from '@angular/core';
import { MedicationService } from './medication.service';
import { JsonPipe, NgClass } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-medicationdetail',
  standalone: true,
  imports: [JsonPipe, NgClass],
  template: `
    @for( med of medications();track med._id){ @if(med._id===medicationid()){
    <div>
      <div class="medication-detail">
        <div class="medication-field">
          <strong>Name:</strong> {{ med.name }}
        </div>
        <div class="medication-field">
          <strong>Generic Name:</strong> {{ med.generic_name }}
        </div>
        <div class="medication-field">
          <strong>Class:</strong> {{ med.medication_class }}
        </div>
        <div class="medication-field">
          <strong>Availability:</strong> {{ med.availability }}
        </div>
        <div class="medication-field">
          <strong>Added By:</strong> {{ med.added_by?.fullname }}
        </div>
        <img
          [src]="'http://localhost:3000/medications/images/' + med_image_id()"
          [ngClass]="{ image: true }"
        />
        &nbsp;<button (click)="go_to_list()">explore review list</button>
      </div>
    </div>
    } }
  `,
  styles: [
    `
      .medication-detail {
        margin-bottom: 20px;
        padding: 15px;
        border: 1px solid #e0e0e0;
        border-radius: 10px;
        background-color: #f5f5f5;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .medication-field {
        margin: 8px 0;
        font-size: 14px;
      }

      .reviews {
        margin-top: 25px;
        padding: 10px;
        background-color: #fafafa;
        border-radius: 10px;
      }

      .review {
        margin-bottom: 20px;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 8px;
        background-color: #ffffff;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .review-field {
        margin: 5px 0;
        font-size: 13px;
      }

      h3 {
        margin-bottom: 15px;
        font-size: 16px;
        color: #333;
      }
      .image {
        height: 300px;
        width: 300px;
      }
    `,
  ],
})
export class MedicationdetailComponent {
  medicationid = input<string>();
  med_image_id = input<string>();
  medications = inject(MedicationService).medications;
  navigation = inject(Router);

  get image_id(): string {
    return `http://localhost:3000/medications/images/${this.med_image_id()}`;
  }

  go_to_list() {
    this.navigation.navigate([
      '',
      'med_route',
      'medications',
      `${this.medicationid()}`,
      'review-list',
    ]);
  }
}
