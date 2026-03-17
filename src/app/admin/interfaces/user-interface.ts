
export interface Role {
  id: string;
  nombre: string;
  descripcion: string;
}

export interface Persona {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  documento_identidad: string;
}

export interface UserInterface {
  id: string;
  email: string;
  ultimo_login: string;
  estado: string;
  origen_registro: string;
  roles: Role[];
  persona: Persona;
}


// interfaces para editar y crear 

export interface CreateUserData {
  email: string;
  estado?: string;
  roles: string[]; // aquí solo IDs
}

export interface passworduser {
  newpassword: string;
  
}


export interface CreatePersona {
  nombre: string;
  apellido: string;
  documento_identidad: string;
  telefono: string;
  email?: string;
}

export interface CreateUserDto {
  persona: CreatePersona;
  user: CreateUserData;
}