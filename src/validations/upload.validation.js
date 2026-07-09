import { checkSchema } from 'express-validator';

// Valida el ID del ponente antes de subir su imagen.
export const imagenPonenteValidation = checkSchema({
  ponente_id: {
    notEmpty: {
      errorMessage: 'ponente_id es obligatorio',
    },
    isUUID: {
      errorMessage: 'ponente_id no es un UUID válido',
    },
  },
// El identificador llega en la query: ?ponente_id=...
}, ['query']);

// Valida los IDs necesarios para subir una presentación.
export const presentacionValidation = checkSchema({
  evento_id: {
    notEmpty: {
      errorMessage: 'evento_id es obligatorio',
    },
    isUUID: {
      errorMessage: 'evento_id no es un UUID válido',
    },
  },
  ponente_id: {
    notEmpty: {
      errorMessage: 'ponente_id es obligatorio',
    },
    isUUID: {
      errorMessage: 'ponente_id no es un UUID válido',
    },
  },
// Los dos identificadores llegan como parámetros de consulta.
}, ['query']);
