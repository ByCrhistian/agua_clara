// auth/types.ts

export interface User {
  id: number;
  usuario: string;
  nombre: string;
  rol: string;
  token: string;
}

export interface LoginRequest {
  usuario: string;
  contrasena: string;
}

export interface LoginResponse {
  token: string;
  usuario: User;
}