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

// Valida el ID del ponente para subir su CV.
export const cvValidation = checkSchema({
  ponente_id: {
    notEmpty: {
      errorMessage: 'ponente_id es obligatorio',
    },
    isUUID: {
      errorMessage: 'ponente_id no es un UUID válido',
    },
  },
}, ['query']);

// Valida el ID del ponente y tipo (ida/vuelta) para subir billetes.
export const billeteValidation = checkSchema({
  ponente_id: {
    notEmpty: {
      errorMessage: 'ponente_id es obligatorio',
    },
    isUUID: {
      errorMessage: 'ponente_id no es un UUID válido',
    },
  },
  tipo: {
    notEmpty: {
      errorMessage: 'tipo es obligatorio (ida o vuelta)',
    },
    isIn: {
      options: [['ida', 'vuelta']],
      errorMessage: 'tipo debe ser "ida" o "vuelta"',
    },
  },
}, ['query']);
