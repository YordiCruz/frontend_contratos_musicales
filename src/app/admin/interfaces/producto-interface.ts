import { CategoriaInterface } from "./categoria-interface"

export interface ProductoInterface {
    id?: number
    nombre: string
    activo: boolean
    categoria: CategoriaInterface
    categoria_id: number
    codigo_barra: string
    descripcion: string
    fecha_registro: string
    imagen_url: string
    marca: string
    precio_venta_actual: number
    stock_minimo: number
    unidad_medida: string
    
}