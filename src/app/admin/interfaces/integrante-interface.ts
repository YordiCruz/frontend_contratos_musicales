import { Especialidad } from "./especialidad";

export interface IntegranteInterface {
  id: string;
  tarifa_base_hora: string;
  moneda: string;
  fecha_ingreso: string;
  estado: string;

  persona: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    documento_identidad: string;
  };

  especialidades: Especialidad[]; // 👈 CORRECTO
}



export interface Persona {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  documento_identidad: string;
}
