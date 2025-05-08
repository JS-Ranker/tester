// src/services/duenos.ts - Versión actualizada

// URL base de la API
const API_URL = 'http://localhost:3000'; // Cambia esto según la URL de tu backend

// Interfaces para los tipos de datos
export interface IDueno {
  rut: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  password?: string; // opcional cuando recibimos del backend
  fecha_registro?: string;
  activo?: boolean | number;
}

export interface IRegistroResponse {
  mensaje: string;
  dueno: IDueno;
}

export interface ILoginResponse {
  mensaje: string;
  dueno: {
    rut: string;
    activo: boolean | number;
  };
}

// Servicio para manejar las peticiones a la API
export const apiService = {
  // Registro de un nuevo dueño
  async registrarDueno(dueno: Omit<IDueno, 'fecha_registro' | 'activo'>): Promise<IRegistroResponse> {
    try {
      const response = await fetch(`${API_URL}/api/duenos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dueno),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al registrar usuario');
      }

      return await response.json();
    } catch (error: any) {
      console.error('Error en la petición de registro:', error);
      throw error;
    }
  },

  // Login de un dueño
  async loginDueno(rut: string, password: string): Promise<ILoginResponse> {
    try {
      const response = await fetch(`${API_URL}/api/duenos/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rut, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al iniciar sesión');
      }

      return await response.json();
    } catch (error: any) {
      console.error('Error en la petición de login:', error);
      throw error;
    }
  },

  // Obtener datos de un dueño por RUT
  async obtenerDuenoPorRut(rut: string): Promise<IDueno> {
    try {
      const response = await fetch(`${API_URL}/api/duenos/${rut}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Si usas autenticación por token:
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al obtener datos del usuario');
      }

      return await response.json();
    } catch (error: any) {
      console.error('Error en la petición para obtener dueño:', error);
      throw error;
    }
  },
};