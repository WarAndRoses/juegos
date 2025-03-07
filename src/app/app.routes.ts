import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'main',
    loadComponent: () => import('./main/main.page').then( m => m.MainPage)
  },
  {
    path: 'en-ejecucion',
    loadComponent: () => import('./en-ejecucion/en-ejecucion.page').then( m => m.EnEjecucionPage)
  },
  {
    path: 'ventas',
    loadComponent: () => import('./ventas/ventas.page').then( m => m.VentasPage)
  },
];
