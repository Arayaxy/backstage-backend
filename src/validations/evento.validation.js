import { checkSchema } from 'express-validator';

export const eventoIdValidation = checkSchema({
  id: {
    isUUID: {
      errorMessage: 'El identificador del evento no es válido',
    },
  },
}, ['params']);

export const createEventoValidation = checkSchema({
  nombreEvento: {
    trim: true,
    notEmpty: {
      errorMessage: 'El nombre del evento es obligatorio',
    },
    isLength: {
      options: { min: 2, max: 150 },
      errorMessage: 'El nombre del evento debe tener entre 2 y 150 caracteres',
    },
    escape: true,
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
    escape: true,
  },
  tipoEvento: {
    trim: true,
    notEmpty: {
      errorMessage: 'El tipo de evento es obligatorio',
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
    toInt: true,
  },
  fechaInicio: {
    notEmpty: {
      errorMessage: 'La fecha de inicio es obligatoria',
    },
    isISO8601: {
      options: { strict: true, strictSeparator: true },
      errorMessage: 'La fecha de inicio no es válida',
    },
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
      options: (value, { req }) => {
        if (new Date(value) < new Date(req.body.fechaInicio)) {
          throw new Error('La fecha de fin no puede ser anterior a la fecha de inicio');
        }
        return true;
      },
    },
    toDate: true,
  },
  idCliente: {
    notEmpty: {
      errorMessage: 'El id del cliente es obligatorio',
    },
    isUUID: {
      errorMessage: 'El id del cliente no es un UUID válido',
    },
  },
  estado: {
    notEmpty: {
      errorMessage: 'El estado del evento es obligatorio',
    },
    isIn: {
      options: [['planificado', 'reservado', 'confirmado', 'finalizado', 'cancelado']],
      errorMessage: 'El estado no es válido',
    },
  },
}, ['body']);

export const updateEventoValidation = checkSchema({
  nombreEvento: {
    optional: true,
    trim: true,
    isLength: {
      options: { min: 2, max: 150 },
      errorMessage: 'El nombre del evento debe tener entre 2 y 150 caracteres',
    },
    escape: true,
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
  tipoEvento: {
    optional: true,
    trim: true,
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
      options: (value, { req }) => {
        if (req.body.fechaInicio && new Date(value) < new Date(req.body.fechaInicio)) {
          throw new Error('La fecha de fin no puede ser anterior a la fecha de inicio');
        }
        return true;
      },
    },
    toDate: true,
  },
  idCliente: {
    optional: true,
    isUUID: {
      errorMessage: 'El id del cliente no es un UUID válido',
    },
  },
  estado: {
    optional: true,
    isIn: {
      options: [['planificado', 'reservado', 'confirmado', 'finalizado', 'cancelado']],
      errorMessage: 'El estado no es válido',
    },
  },
}, ['body']);
