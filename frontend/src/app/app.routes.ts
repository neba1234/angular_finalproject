import { Routes } from '@angular/router';
import { SigninComponent } from '../../auth/signin.component';
import { SignupComponent } from '../../auth/signup.component';
import { MedicationlistComponent } from './medicationlist/medicationlist.component';

export const routes: Routes = [
  { path: '', component: MedicationlistComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'med_route',
    loadChildren: () =>
      import('./medicationlist/medication_routes').then((r) => r.med_route),
  },
];
