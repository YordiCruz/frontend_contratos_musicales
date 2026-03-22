import { Component, signal } from '@angular/core';
import { CategoriaService } from '../../../services/categoria-service';
import { PrimengModule } from '../../../../primeng/primeng-module';
import { CategoriaInterface } from '../../../interfaces/categoria-interface';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './categoria.html',
  styleUrls: []
})
export class Categoria {

  // Señales para manejar datos y estado de carga
  categorias = signal<CategoriaInterface[]>([]);
  loading = signal(true);

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit() {
    this.loadCategorias();
  }

  /** ============================
   *  CARGAR LISTA DE CATEGORÍAS
   *  ============================ */
  loadCategorias() {
    this.loading.set(true);

    this.categoriaService.index().subscribe({
      next: (data) => {
        this.categorias.set(data || []);
        this.loading.set(false);
      },
      error: () => {
        this.categorias.set([]);
        this.loading.set(false);
      }
    });
  }
}