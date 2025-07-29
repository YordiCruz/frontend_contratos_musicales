import { Component, effect, inject, OnInit, Signal, signal, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { ProductoService } from '../../../services/producto-service';
import { SucursalesService } from '../../../services/sucursal-service';
import { AlmacenesService } from '../../../services/almacen-service';
import { CategoriaService } from '../../../services/categoria-service';
import { CategoriaInterface } from '../../../interfaces/categoria-interface';
interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

@Component({
  selector: 'app-producto-component',
  standalone: false,
  templateUrl: './producto-component.html',
  styleUrl: './producto-component.scss'
})
export class ProductoComponent implements OnInit{

  productoService = inject(ProductoService)
  sucursalService = inject(SucursalesService)
  almacenService = inject(AlmacenesService)
  categoriaService = inject(CategoriaService)

  buscar$ = signal('');

    products = signal<any[]>([]);

    product!: any;

    selectedProducts!: any[] | null;

    submitted: boolean = false;

    cols!: Column[];

  @ViewChild('dt') dt!: Table;

  almacenes = signal([])
  //selectedAlmacen = signal('');
   selectedAlmacen = signal(''); // Cambiado a number para coincidir 
  totalRecords = signal(0)
  sucursales = signal([])

selectedSucursal = signal<number | null>(null); // Permitir null inicial

productDialog = signal<boolean>(false);


loading = signal(false);

  buscar = signal("");

  categorias = signal<CategoriaInterface[]>([]);

  productDialogImagen = signal<boolean>(false);
  producto_seleccionado = signal({});



  ngOnInit(): void {
    this.funGetProductos();
    this.funGetSucursales();
    this.funGetCategorias();

  }

  cargarDatos(event: any){
    let page = event.first / event.rows + 1;

    this.funGetProductos(page, event.rows);
  }



  funGetProductos(page: number = 1, limit: number = 5){ 
    this.loading.set(true);

    this.productoService.funListar(this.selectedAlmacen(), page, limit, this.buscar()).subscribe(
      (res: any) => {
        console.log(res.data);
        this.products.set(res.data);
        
        this.totalRecords.set(res.total);
        this.loading.set(false);
      },
      (err) => {
      console.error('Error al cargar productos:', err);
      this.products.set([]);
      this.totalRecords.set(0);
      this.loading.set(false);
      // Opcional: mostrar mensaje de error al usuario
    }
    )
   
  
}

  

  //para mirar datos que se envian, en la consola
// funGetProductos(page: number = 1, limit: number = 5) {
//   console.log('[DEBUG] - Iniciando funGetProductos()');
//   console.log('[DEBUG] - selectedAlmacen():', this.selectedAlmacen()); // 👈 Valor actual
  
//   if (!this.selectedAlmacen()) {
//     console.warn('[WARN] - No hay almacén seleccionado. Abortando.');
//     return;
//   }

//   console.log('[DEBUG] - Parámetros enviados:', {
//     almacen_id: this.selectedAlmacen()!.toString(),
//     page,
//     limit,
//     search: this.buscar()
//   });

//   this.loading.set(true);
  
//   this.productoService
//     .funListar(
//       this.selectedAlmacen()!.toString(), 
//       page, 
//       limit, 
//       this.buscar()
//     )
//     .subscribe({
//       next: (res: any) => {
//         console.log('[DEBUG] - Respuesta del servidor:', res); // 👈 Respuesta completa
        
//         this.products.set(res.data || []);
//         this.totalRecords.set(res.total || 0);
        
//         console.log('[DEBUG] - Productos actualizados:', this.products()); // 👈 Ver resultado
//         this.loading.set(false);
//       },
//       error: (err) => {
//         console.error('[ERROR] - Error al cargar productos:', err);
//         this.loading.set(false);
//       }
//     });
// }


  // funGetProductos(page: number = 1, limit: number = 5){
  //   this.loading.set(true)
  //   this.productoService.funListar(this.selectedAlmacen(), page, limit, this.buscar()).subscribe(
  //     (res: any) => {
  //       this.products.set(res.data);
  //       this.totalRecords.set(res.total);

  //       this.loading.set(false);
  //     }
  //   )
  // }

  funGetCategorias(){
    this.categoriaService.index().subscribe(
      (res: any) => {
        console.log(res.data)
        this.categorias.set(res);
      }
    )
  }


  funGetSucursales(){
    this.sucursalService.funListar().subscribe(
      (res: any) => {
        this.sucursales.set(res);
      }
    )
  }


   funGetAlmacenes() {
    if (!this.selectedSucursal()) return;
    
    this.almacenService.funListar(this.selectedSucursal()!).subscribe({
      next: (res: any) => {
        this.almacenes.set(Array.isArray(res) ? res : res?.data || []);
      },
      error: (err) => {
        this.almacenes.set([]);
      }
    });
  }

  // funGetAlmacenes(){
  //   this.almacenService.funListar(this.selectedSucursal()).subscribe(
  //     (res: any) => {
  //       console.log(res.data)
  //       this.almacenes.set(res);
  //     }
  //   )
  // }


  exportCSV() {
      this.dt.exportCSV();
  }

  openNew() {
    this.product = {};
    this.submitted = false;
    this.productDialog.set(true);
}

hideDialog() {
  this.productDialog.set(false);
  this.submitted = false;
}

hideDialogImagen(){
  this.productDialogImagen.set(false);

}

editProduct(product: any) {
  this.product = { ...product };
  this.productDialog.set(true);
}

deleteProduct(prod: any) {
  
}


saveProduct() {
  this.submitted = true;

  if (this.product.nombre?.trim()) {
    // Definir interfaz para el producto
    interface ProductoPayload {
      nombre: string;
      descripcion?: string;
      precio_venta_actual: string;
      categoriaId: number;
      marca?: string;
      unidad_medida?: string;
      fecha_registro?: string;
      stock_minimo?: number;
      //activo: boolean;
    }

    // Preparar el objeto para enviar con tipos explícitos
    const productoParaEnviar: ProductoPayload = {
      nombre: this.product.nombre,
      descripcion: this.product.descripcion,
      precio_venta_actual: String(this.product.precio_venta_actual),
      categoriaId: Number(this.product.categoria_id || this.product.categoriaId || 0),
      marca: this.product.marca,
      unidad_medida: this.product.unidad_medida,
      fecha_registro: this.product.fecha_registro,
      stock_minimo: Number(this.product.stock_minimo),
      //activo: Boolean(this.product.activo)
    };

    // Eliminar propiedades undefined/null de manera tipada
    (Object.keys(productoParaEnviar) as Array<keyof ProductoPayload>).forEach(key => {
      if (productoParaEnviar[key] === undefined || productoParaEnviar[key] === null) {
        delete productoParaEnviar[key];
      }
    });

    this.productoService.funGuardar(productoParaEnviar).subscribe({
      next: (res) => {
        alert("Producto Registrado");
        this.productDialog.set(false);
        this.funGetProductos();
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        alert(`Error al registrar producto: ${err.error?.message || err.message}`);
      }
    });
  }
}



// Función auxiliar para parsear decimales
private parseDecimal(value: any): number {
  const num = Number(value);
  return isNaN(num) ? 0 : parseFloat(num.toFixed(2));
}

// Función auxiliar para parsear enteros
private parseInt(value: any): number {
  const num = Number(value);
  return isNaN(num) ? 0 : Math.round(num);
}


    editImagenProduct(prod: any){
      this.productDialogImagen.set(true);
      this.producto_seleccionado.set(prod);
    }
    

    funSubirImagen(event: any){
      console.log(event.files[0]);
      const imagen = event.files[0];

      let formData = new FormData();
      //file es el nombre que el backend espera
      formData.append("file", imagen);
console.log(this.producto_seleccionado());
      this.productoService.actualizarImagen(this.producto_seleccionado(), formData).subscribe(
        (res) => {
          this.hideDialogImagen();
          this.funGetProductos();
        }
      )

    }

    

    

}