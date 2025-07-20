import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptorInterceptor } from './core/interceptors/auth-interceptor-interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // Importa esto
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptorInterceptor] ), withFetch()),
    provideAnimationsAsync(), // Agrega esta línea
    providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } })

  ]
};