import { Component } from '@angular/core';
import { CategoriasEventos } from './categorias-eventos/categorias-eventos';
import { Events } from './events/events';

@Component({
  selector: 'app-eventos',
  imports: [CategoriasEventos, Events],
  templateUrl: './eventos.html',
  styleUrl: './eventos.scss',
})
export class Eventos {

}
