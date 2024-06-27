import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { MedicationlistComponent } from './medicationlist.component';
import { AuthService } from '../../../auth/auth.service';
export const med_route: Routes = [
  { path: '', component: MedicationlistComponent },
  {
    path: 'add-medication',
    loadComponent: () =>
      import('./medicationadd.component').then((c) => c.MedicationaddComponent),
    canActivate: [
      () => inject(AuthService).is_logged_in() || inject(AuthService).signup,
    ],
  },
  {
    path: 'medication-list',
    component: MedicationlistComponent,
  },
  {
    path: 'update/:updateid',
    loadComponent: () =>
      import('./medicationupdate.component').then(
        (c) => c.MedicationupdateComponent
      ),
    canActivate: [
      () => inject(AuthService).is_logged_in() || inject(AuthService).signup,
    ],
  },

  {
    path: 'add-review',
    loadComponent: () =>
      import('../reviews/reviewadd.component').then(
        (c) => c.ReviewaddComponent
      ),
    canActivate: [
      () => inject(AuthService).is_logged_in() || inject(AuthService).signup,
    ],
  },
  {
    path: 'medication-detail',
    loadComponent: () =>
      import('./medicationdetail.component').then(
        (c) => c.MedicationdetailComponent
      ),
  },
  {
    path: 'medication',
    loadComponent: () =>
      import('./medication.component').then((c) => c.MedicationComponent),
  },
  {
    path: 'medications/:id/review-list',
    loadComponent: () =>
      import('../reviews/reviews.component').then((c) => c.ReviewsComponent),
  },
  {
    path: 'medications/:med_id/review-list/:review_id',
    loadComponent: () =>
      import('../reviews/reviewupdate.component').then(
        (c) => c.ReviewupdateComponent
      ),
    canActivate: [
      () => inject(AuthService).is_logged_in() || inject(AuthService).signup,
    ],
  },
  { path: '**', redirectTo: 'medication-list' },
];
