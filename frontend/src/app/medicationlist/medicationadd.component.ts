import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Medication } from '../types';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MedicationService } from './medication.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-add-medicine',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <div class="container">
      <h2>Add Medication</h2>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <mat-form-field appearance="fill">
          <mat-label>Name</mat-label>
          <input
            matInput
            placeholder="Enter medication name"
            formControlName="name"
          />
          @if(form.controls.name.hasError('required')){
          <mat-error>Name is required</mat-error>
          } @if(form.controls.name.hasError('exists')){
          <mat-error>Medication name already exists</mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Generic Name</mat-label>
          <input
            matInput
            placeholder="Enter generic name"
            formControlName="generic_name"
          />
          @if(form.controls.generic_name.hasError('required')){
          <mat-error>Generic name is required</mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Medication Class</mat-label>
          <input
            matInput
            placeholder="Enter medication class"
            formControlName="medication_class"
          />
          @if(form.controls.medication_class.hasError('required')){
          <mat-error>Medication class is required</mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Availability</mat-label>
          <input
            matInput
            placeholder="Enter availability"
            formControlName="availability"
          />
          @if(form.controls.availability.hasError('required')){
          <mat-error>Availability is required</mat-error>
          }
        </mat-form-field>
        <input
          formControlName="image"
          type="file"
          (change)="onFileSelect($event)"
        />
        <button
          mat-raised-button
          color="primary"
          type="submit"
          [disabled]="form.invalid"
        >
          Submit
        </button>
      </form>
    </div>
  `,
  styles: [
    `
      .container {
        max-width: 600px;
        margin: auto;
        padding: 20px;
      }
      form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
    `,
  ],
})
export class MedicationaddComponent {
  http = inject(HttpClient);
  notification = inject(ToastrService);
  navigation = inject(Router);
  medications = inject(MedicationService).medications;
  form = inject(FormBuilder).group({
    name: ['', [Validators.required], this.check_name_exists.bind(this)],
    generic_name: ['', Validators.required],
    medication_class: ['', Validators.required],
    availability: ['', Validators.required],
    image: '',
  });
  file!: File;

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files!.length > 0) this.file = input.files![0];
  }

  check_name_exists(
    control: AbstractControl
  ): Observable<null | Record<string, boolean>> {
    return this.http.get<null | { exists: boolean }>(
      `${environment.BACKEND_SERVER}/medications/by-name?name=${control.value}`
    );
  }

  submit() {
    const formData = new FormData();
    formData.append('name', this.form.get('name')?.value as string);
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
    formData.append('medication_image', this.file);
    this.http
      .post<{ success: boolean; data: Medication }>(
        `${environment.BACKEND_SERVER}/medications`,
        formData
      )
      .subscribe((response) => {
        if (response.success) {
          this.notification.success('Added successfully');
          this.form.reset();
          this.navigation.navigate(['', 'med_route', 'medication-list']);
        }
      });
  }
}
