import { Routes } from '@angular/router';
import { inicio } from './inicio.component';
import { juego } from './juego.component';
import { contacto } from './contacto.component';

export const routes: Routes = [
    { path: 'inicio', component: inicio },
    { path: 'contacto', component: contacto },
    { path: 'juego', component: juego },
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
];
