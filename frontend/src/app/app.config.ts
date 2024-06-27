import {
  APP_INITIALIZER,
  ApplicationConfig,
  inject,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

function bootstrap() {
  let global = inject(AuthService);
  let datapersist = localStorage.getItem('key');

  if (datapersist) {
    global.state.set(JSON.parse(datapersist));
  }
}

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { addTokenInterceptor } from '../../auth/addToken.interceptor';
import { AuthService } from '../../auth/auth.service';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([addTokenInterceptor])),
    { provide: APP_INITIALIZER, useFactory: bootstrap },
    provideToastr(),
    provideAnimationsAsync(),
    provideAnimationsAsync(),
  ],
};
