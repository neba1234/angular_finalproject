import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService, State, User } from './auth.service';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-signin',
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
      <h3>please sign in to add medications</h3>
      <form [formGroup]="form" (ngSubmit)="onsubmit()">
        <mat-form-field appearance="fill">
          <mat-label>Email</mat-label>
          <input
            matInput
            type="email"
            placeholder="email"
            formControlName="email"
          />
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Password</mat-label>
          <input
            matInput
            type="password"
            placeholder="password"
            formControlName="password"
          />
        </mat-form-field>
        <button
          mat-raised-button
          color="primary"
          type="submit"
          [disabled]="form.invalid"
        >
          Sign In
        </button>
      </form>
    </mat-card>
  `,
  styles: [
    `
      mat-card {
        max-width: 800px;
        margin: 2em auto;
        padding: 1em;
      }
      mat-form-field {
        width: 100%;
      }
      button {
        width: 100%;
        margin-top: 1em;
      }
    `,
  ],
})
export class SigninComponent {
  router = inject(Router);
  global = inject(AuthService);
  notification = inject(ToastrService);
  form = inject(FormBuilder).group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onsubmit() {
    return this.global.signin(this.form.value as User).subscribe((res) => {
      if (res.success) {
        let token = jwtDecode(res.data) as State;
        this.global.state.set({
          _id: token._id,
          fullname: token.fullname,
          email: token.email,
          jwt: res.data,
        });
        this.notification.success('signin success');
        this.router.navigate([
          '',
          'med_route',
          'medications',
          'medication-list',
        ]);
      }
    });
  }
}
