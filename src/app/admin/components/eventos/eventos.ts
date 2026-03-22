import { Component } from '@angular/core';
import { CategoriasEventos } from './categorias-eventos/categorias-eventos';
import { Events } from './events/events';
import { PrimeNG } from 'primeng/config';
import { PrimengModule } from '../../../primeng/primeng-module';

@Component({
  selector: 'app-eventos',
  imports: [CategoriasEventos, Events, PrimengModule],
  templateUrl: './eventos.html',
  styleUrl: './eventos.scss',
})
export class Eventos {

    tabs = [
    { title: 'Eventos', value: '0' },
    { title: 'Categorías', value: '1' }
  ];


}
