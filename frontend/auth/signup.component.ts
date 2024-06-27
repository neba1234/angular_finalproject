import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, User } from './auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-signup',
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
      <h3>please sign up to add medications or add review</h3>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <mat-form-field appearance="fill">
          <mat-label>Full Name</mat-label>
          <input
            matInput
            type="text"
            placeholder="Full Name"
            formControlName="fullname"
          />
          @if(form.get('fullname')?.hasError('required')){
          <mat-error> Full Name is required </mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Email</mat-label>
          <input
            matInput
            type="email"
            placeholder="Email"
            formControlName="email"
          />

          @if(form.get('email')?.hasError('required')){
          <mat-error> Email is required </mat-error>
          } @if(form.get('email')?.hasError('email')){
          <mat-error> Please enter a valid email </mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Password</mat-label>
          <input
            matInput
            type="password"
            placeholder="Password"
            formControlName="password"
          />

          @if(form.get('password')?.hasError('required')){
          <mat-error> Password is required </mat-error>
          } @if(form.get('password')?.hasError('minlength')){
          <mat-error> Password must be at least 6 characters long </mat-error>
          }
        </mat-form-field>

        <button
          mat-raised-button
          color="primary"
          type="submit"
          [disabled]="form.invalid"
        >
          Signup
        </button>
      </form>
    </mat-card>
  `,
  styles: [
    `
      mat-card {
        width: 800px;
        margin: 2rem auto;
        padding: 2rem;
      }
      h1 {
        text-align: center;
      }
      mat-form-field {
        width: 100%;
      }
    `,
  ],
})
export class SignupComponent {
  global = inject(AuthService);
  router = inject(Router);
  notification = inject(ToastrService);
  form = inject(FormBuilder).group({
    fullname: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.global.signup(this.form.value as User).subscribe((res) => {
      if (res.success) {
        this.notification.success('Signup successful');
        this.router.navigate(['', 'med_route', 'medication-list']);
      } else {
        this.notification.error('Signup failed');
      }
    });
  }
}
