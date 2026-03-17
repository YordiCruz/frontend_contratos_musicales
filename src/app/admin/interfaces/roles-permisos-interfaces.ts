export interface RolesInterface {
    id: string;
    nombre: string;
    descripcion: string;
    permisos: PermisosInterface[];
}

export interface PermisosInterface {
    id: string;
    nombre: string;
    descripcion: string;
}