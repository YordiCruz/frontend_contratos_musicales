import { Component, inject, OnInit, signal } from '@angular/core';
import { CategoriaInterface } from '../../../interfaces/categoria-interface';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CategoriaService } from '../../../services/categoria-service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-categoria-component',
  standalone: false,
  templateUrl: './categoria-component.html',
  styleUrl: './categoria-component.scss'
})
export class CategoriaComponent implements OnInit {
  categorias = signal<CategoriaInterface[]>([]);

  categoriaService = inject(CategoriaService);

  visiblecate = signal<boolean>(false);

  cateForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    descripcion: new FormControl(''),
  });

  ngOnInit(): void {
    this.listar();
  }

  listar(): void {
    this.categoriaService.index().subscribe(
    (data: CategoriaInterface[]) => {
      this.categorias.set(data);
    },
    (error: any) => {
      console.log(error);
    }
  )
  }

  newCategoryDialog(){
    this.visiblecate.set(true);
  }

  funGuardarCate(){
    let data: CategoriaInterface = {nombre: this.cateForm.value.nombre+"", descripcion: this.cateForm.value.descripcion + ""}
    this.categoriaService.store(data).subscribe(
      (data: CategoriaInterface) => {
        this.listar();
        this.visiblecate.set(false);
      },
      (error: any) => {
        console.log(error);
      }
    )
  }

}
