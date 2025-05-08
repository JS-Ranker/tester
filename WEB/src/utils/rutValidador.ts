// src/utils/rutValidator.ts

/**
 * Función que valida el formato de un RUT chileno
 * @param rut String con el RUT a validar
 * @returns Boolean que indica si el RUT es válido o no
 */
export const validarRut = (rut: string): boolean => {
    // Eliminar puntos y guiones
    rut = rut.replace(/\./g, '').replace(/-/g, '');
    
    // Validar largo mínimo
    if (rut.length < 7) return false;
    
    // Separar cuerpo y dígito verificador
    const cuerpo = rut.slice(0, -1);
    const dv = rut.slice(-1).toUpperCase();
    
    // Calcular dígito verificador
    let suma = 0;
    let multiplo = 2;
    
    // Para cada dígito del cuerpo
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo.charAt(i)) * multiplo;
      multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }
    
    // Calcular dígito verificador esperado
    const dvEsperado = 11 - (suma % 11);
    let dvCalculado: string;
    
    if (dvEsperado === 11) dvCalculado = '0';
    else if (dvEsperado === 10) dvCalculado = 'K';
    else dvCalculado = dvEsperado.toString();
    
    // Comparar dígito verificador
    return dvCalculado === dv;
  };
  
  /**
   * Función que formatea un RUT al formato chileno estándar (XX.XXX.XXX-X)
   * @param rut String con el RUT a formatear
   * @returns String con el RUT formateado
   */
  export const formatearRut = (rut: string): string => {
    // Eliminar puntos y guiones
    rut = rut.replace(/\./g, '').replace(/-/g, '');
    
    // Separar cuerpo y dígito verificador
    const cuerpo = rut.slice(0, -1);
    const dv = rut.slice(-1);
    
    // Formatear con puntos y guión
    let rutFormateado = '';
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      rutFormateado = cuerpo.charAt(i) + rutFormateado;
      if ((cuerpo.length - i) % 3 === 0 && i !== 0) {
        rutFormateado = '.' + rutFormateado;
      }
    }
    
    return rutFormateado + '-' + dv;
  };