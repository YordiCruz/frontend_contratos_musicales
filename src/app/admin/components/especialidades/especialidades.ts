import { Component } from '@angular/core';
import { PrimengModule } from '../../../primeng/primeng-module';
import { Categoria } from './categorias-especialidades/categoria';
import { Especialidads } from './especialidad/especialidads';

@Component({
  selector: 'app-especialidades',
  imports: [PrimengModule, Categoria, Especialidads],
  templateUrl: './especialidades.html',
  styleUrl: './especialidades.scss',
})
export class Especialidades {

}
