import { checkSchema } from 'express-validator';

// Valida el ID del cliente que llega como parte de la URL.
export const clienteIdValidation = checkSchema({
  id: {
    isUUID: {
      errorMessage: 'El identificador del cliente no es válido',
    },
  },
}, ['params']);

// Valida todos los campos necesarios para crear un cliente.
export const createClienteValidation = checkSchema({
  nombre: {
    // Elimina espacios al principio y al final.
    trim: true,
    notEmpty: {
      errorMessage: 'El nombre del cliente es obligatorio',
    },
    isLength: {
      options: { min: 2, max: 100 },
      errorMessage: 'El nombre debe tener entre 2 y 100 caracteres',
    },
    matches: {
      options: [/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'.-]+$/],
      errorMessage: 'El nombre contiene caracteres no permitidos',
    },
    // Escapa caracteres que podrían interpretarse como HTML.
    escape: true,
  },
  correo: {
    trim: true,
    notEmpty: {
      errorMessage: 'El correo del cliente es obligatorio',
    },
    isEmail: {
      errorMessage: 'El formato del correo no es correcto',
    },
    // Convierte el correo a un formato uniforme.
    normalizeEmail: true,
  },
}, ['body']);

// Valida los campos que se pueden modificar en un cliente.
export const updateClienteValidation = checkSchema({
  nombre: {
    // El campo puede faltar, pero si se envía debe ser válido.
    optional: true,
    trim: true,
    isLength: {
      options: { min: 2, max: 100 },
      errorMessage: 'El nombre debe tener entre 2 y 100 caracteres',
    },
    matches: {
      options: [/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'.-]+$/],
      errorMessage: 'El nombre contiene caracteres no permitidos',
    },
    escape: true,
  },
  correo: {
    // Permite actualizar el nombre sin tener que enviar el correo.
    optional: true,
    trim: true,
    isEmail: {
      errorMessage: 'El formato del correo no es correcto',
    },
    normalizeEmail: true,
  },
}, ['body']);
