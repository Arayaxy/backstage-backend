import { checkSchema } from 'express-validator';

// Valida el ID del evento recibido en la URL.
export const eventoIdValidation = checkSchema({
  id: {
    isUUID: {
      errorMessage: 'El identificador del evento no es válido',
    },
  },
}, ['params']);

// Valida los datos obligatorios para crear un evento.
export const createEventoValidation = checkSchema({
  nombreCliente: {
    // Limpia los espacios del nombre antes de validarlo.
    trim: true,
    notEmpty: {
      errorMessage: 'El nombre del cliente es obligatorio',
    },
    isLength: {
      options: { min: 2, max: 150 },
      errorMessage: 'El nombre del cliente debe tener entre 2 y 150 caracteres',
    },
    matches: {
      options: [/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'.-]+$/],
      errorMessage: 'El nombre del cliente contiene caracteres no permitidos',
    },
    escape: true,
  },
  numeroPersonas: {
    notEmpty: {
      errorMessage: 'El número de personas es obligatorio',
    },
    isInt: {
      options: { min: 1 },
      errorMessage: 'El número de personas debe ser un entero mayor que cero',
    },
    // Convierte el valor recibido a un número entero.
    toInt: true,
  },
  ciudad: {
    trim: true,
    notEmpty: {
      errorMessage: 'La ciudad es obligatoria',
    },
    isLength: {
      options: { min: 2, max: 100 },
      errorMessage: 'La ciudad debe tener entre 2 y 100 caracteres',
    },
    matches: {
      options: [/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'.-]+$/],
      errorMessage: 'La ciudad contiene caracteres no permitidos',
    },
    escape: true,
  },
  fechaInicio: {
    notEmpty: {
      errorMessage: 'La fecha de inicio es obligatoria',
    },
    isISO8601: {
      options: { strict: true, strictSeparator: true },
      errorMessage: 'La fecha de inicio no es válida',
    },
    // Convierte el texto de la fecha en un objeto Date.
    toDate: true,
  },
  fechaFin: {
    notEmpty: {
      errorMessage: 'La fecha de fin es obligatoria',
    },
    isISO8601: {
      options: { strict: true, strictSeparator: true },
      errorMessage: 'La fecha de fin no es válida',
    },
    custom: {
      // Comprueba que el evento no termine antes de comenzar.
      options: (value, { req }) => {
        if (new Date(value) < new Date(req.body.fechaInicio)) {
          throw new Error('La fecha de fin no puede ser anterior a la fecha de inicio');
        }
        return true;
      },
    },
    toDate: true,
  },
}, ['body']);

// Valida solo los campos enviados al actualizar un evento.
export const updateEventoValidation = checkSchema({
  nombreCliente: {
    // optional permite que el campo no aparezca en la petición.
    optional: true,
    trim: true,
    isLength: {
      options: { min: 2, max: 150 },
      errorMessage: 'El nombre del cliente debe tener entre 2 y 150 caracteres',
    },
    escape: true,
  },
  numeroPersonas: {
    optional: true,
    isInt: {
      options: { min: 1 },
      errorMessage: 'El número de personas debe ser un entero mayor que cero',
    },
    toInt: true,
  },
  ciudad: {
    optional: true,
    trim: true,
    isLength: {
      options: { min: 2, max: 100 },
      errorMessage: 'La ciudad debe tener entre 2 y 100 caracteres',
    },
    escape: true,
  },
  fechaInicio: {
    optional: true,
    isISO8601: {
      options: { strict: true, strictSeparator: true },
      errorMessage: 'La fecha de inicio no es válida',
    },
    toDate: true,
  },
  fechaFin: {
    optional: true,
    isISO8601: {
      options: { strict: true, strictSeparator: true },
      errorMessage: 'La fecha de fin no es válida',
    },
    custom: {
      // Compara las fechas únicamente si también se envió fechaInicio.
      options: (value, { req }) => {
        if (req.body.fechaInicio && new Date(value) < new Date(req.body.fechaInicio)) {
          throw new Error('La fecha de fin no puede ser anterior a la fecha de inicio');
        }
        return true;
      },
    },
    toDate: true,
  },
}, ['body']);
