import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SignupComponent } from '../../auth/signup.component';
import { AuthService } from '../../auth/auth.service';
import { SigninComponent } from '../../auth/signin.component';
import { ReviewaddComponent } from './reviews/reviewadd.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SignupComponent,
    RouterLink,
    SigninComponent,
    ReviewaddComponent,
    MatIconModule,
    MatButtonModule,
  ],
  template: `
    <div class="header">
      <h1>Welcome {{ global.state().fullname }}!</h1>

      @if(global.is_logged_in()){

      <div class="action-buttons">
        <button mat-flat-button color="primary" (click)="global.signOut()">
          <mat-icon>logout</mat-icon> Logout
        </button>
        <a
          mat-flat-button
          color="accent"
          [routerLink]="['med_route', 'add-medication']"
          >Add Medication</a
        >
      </div>

      }@else {

      <div class="auth-links">
        <a mat-flat-button color="primary" [routerLink]="['signin']">Sign In</a>
        <a mat-flat-button color="accent" [routerLink]="['signup']">Sign Up</a>
      </div>

      }
    </div>

    <router-outlet></router-outlet>
  `,
  styles: [
    `
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 20px;
        background-color: #f8f9fa;
        border-bottom: 1px solid #e0e0e0;
      }
      h1 {
        margin: 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #2c3e50;
      }
      .auth-buttons,
      .action-buttons {
        display: flex;
        gap: 10px;
      }
      button,
      a {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        transition: background-color 0.3s, color 0.3s;
      }
      button:hover,
      a:hover {
        background-color: #f0f0f0;
        color: #00796b;
      }
      .auth-buttons a {
        background-color: #00796b;
        color: #fff;
      }
      .auth-buttons a:hover {
        background-color: #004d40;
      }
    `,
  ],
})
export class AppComponent {
  global = inject(AuthService);
}
