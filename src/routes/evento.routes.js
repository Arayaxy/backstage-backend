import { Router } from 'express';
import { body, param, query } from 'express-validator';

import { validarToken } from '../middlewares/auth.middleware.js';
import { validarRol } from '../middlewares/validarRol.js';
import { validate } from '../middlewares/validate.middleware.js';

import {
  getEventos,
  getEvento,
  postEvento,
  patchEvento,
  deleteEvento,
} from '../controllers/evento.controller.js';

export const eventoRouter = Router();

// eventoRouter.use(validarToken, validarRol('admin'));

eventoRouter.get('/', [
  query('ciudad').optional().isString(),
  query('tipo_evento').optional().isString(),
  validate
], getEventos);

eventoRouter.get('/:id', [
  param('id').isUUID(),
  validate
], getEvento);

eventoRouter.post('/', [
  body('nombre_evento').notEmpty(),
  body('clienteId').isUUID(),
  body('estadoId').isUUID(),
  validate
], postEvento);

eventoRouter.patch('/:id', [
  param('id').isUUID(),
  body('clienteId').optional().isUUID(),
  body('estadoId').optional().isUUID(),
  validate
], patchEvento);

eventoRouter.delete('/:id', [
  param('id').isUUID(),
  validate
], deleteEvento);
