import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // Importa esto
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { AdminAuthInterceptor } from './core/interceptors/admin-auth-interceptor';
import { ClientAuthInterceptor } from './core/interceptors/client-auth-interceptor';
import { MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([AdminAuthInterceptor, ClientAuthInterceptor] ), withFetch()),
    provideAnimationsAsync(), // Agrega esta línea
    providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } }),
    MessageService
    
  ]
};