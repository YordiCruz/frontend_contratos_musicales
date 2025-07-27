import { Component, inject, OnInit, signal } from '@angular/core';
import { CategoriaInterface } from '../../../interfaces/categoria-interface';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CategoriaService } from '../../../services/categoria-service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categoria-component',
  standalone: false,
  templateUrl: './categoria-component.html',
  styleUrl: './categoria-component.scss'
})
export class CategoriaComponent implements OnInit{

  categorias = signal<CategoriaInterface[]>([]);
  visibleDiCategoria = signal<boolean>(false);

  categoriaService = inject(CategoriaService);

  categoriaForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    descripcion: new FormControl(''),
  });

  ngOnInit(): void {
    this.listar();
  }

  listar(): void{
    this.categoriaService.index().subscribe(
      (data: CategoriaInterface[]) => {
        this.categorias.set(data);
      },
      (error: any) => {

      }
    );
  }

  funMostrarDialog(){
    this.visibleDiCategoria.set(true);
  }

  funGuardarCategoria(){
    let data: CategoriaInterface = {nombre: this.categoriaForm.value.nombre+"", descripcion: this.categoriaForm.value.descripcion+"" };
    this.categoriaService.store(data).subscribe(
      (res: CategoriaInterface) => {
        this.listar();
        this.visibleDiCategoria.set(false);
      }
    )
  }

}