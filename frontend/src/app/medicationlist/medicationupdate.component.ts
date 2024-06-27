import { JsonPipe } from '@angular/common';
import { Component, effect, inject, input } from '@angular/core';
import { Medication, User } from '../types';
import { Router } from '@angular/router';
import { MedicationComponent } from './medication.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { MedicationService } from './medication.service';
import { ToastrService } from 'ngx-toastr';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-medicationupdate',
  standalone: true,
  imports: [
    JsonPipe,
    MedicationComponent,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
  ],
  template: `
    <mat-card>
      <mat-card-content>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Name</mat-label>
            <input
              matInput
              type="text"
              formControlName="name"
              placeholder="Name"
            />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>First Letter</mat-label>
            <input
              matInput
              type="text"
              formControlName="first_letter"
              placeholder="First Letter"
            />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Generic Name</mat-label>
            <input
              matInput
              type="text"
              formControlName="generic_name"
              placeholder="Generic Name"
            />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Medication Class</mat-label>
            <input
              matInput
              type="text"
              formControlName="medication_class"
              placeholder="Medication Class"
            />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Availability</mat-label>
            <input
              matInput
              type="text"
              formControlName="availability"
              placeholder="Availability"
            />
          </mat-form-field>

          <div class="button-container">
            <button mat-raised-button color="primary" type="submit">
              Update
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      mat-card {
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }

      .full-width {
        width: 100%;
        margin-bottom: 16px;
      }

      .button-container {
        display: flex;
        justify-content: flex-end;
      }
    `,
  ],
})
export class MedicationupdateComponent {
  id = input<string>();
  medications = inject(MedicationService).medications;
  navigation = inject(Router);
  notification = inject(ToastrService);
  state = inject(AuthService).state;
  form = inject(FormBuilder).group({
    name: ['', [Validators.required]],
    first_letter: ['', [Validators.required]],
    generic_name: ['', [Validators.required]],
    medication_class: ['', [Validators.required]],
    availability: ['', [Validators.required]],
    added_by: [(this.state() as User) || ''],
  });

  file!: File;
  http = inject(HttpClient);

  submit() {
    if (this.form.invalid) {
      console.log('Form is invalid');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.form.get('name')?.value as string);
    formData.append(
      'first_letter',
      this.form.get('first_letter')?.value as string
    );
    formData.append(
      'generic_name',
      this.form.get('generic_name')?.value as string
    );
    formData.append(
      'medication_class',
      this.form.get('medication_class')?.value as string
    );
    formData.append(
      'availability',
      this.form.get('availability')?.value as string
    );

    this.http
      .put<{ success: boolean; data: Medication }>(
        `http://localhost:3000/medications/${this.id()}`,
        formData
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.notification.success('Medication updated successfully');
            console.log('Medication updated successfully:', response.data);
            this.form.reset();
            this.navigation.navigate(['', 'med_route', 'medication-list']);
          } else {
            this.notification.error('Failed to update medication');
            console.log('Failed to update medication');
          }
        },
        error: (error) => {
          this.notification.error('Error updating medication');
          console.error('Error updating medication:', error);
        },
      });
  }

  constructor() {
    effect(() => {
      for (let med of this.medications()) {
        if (med._id === this.id()) {
          this.form.patchValue({
            name: med.name,
            first_letter: med.first_letter,
            generic_name: med.generic_name,
            availability: med.availability,
            medication_class: med.medication_class,
          });
        }
      }
    });
  }
}
