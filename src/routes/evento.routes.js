import { Router } from 'express';
import { body, param } from 'express-validator';

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

eventoRouter.get('/', getEventos);

eventoRouter.get('/:id', [
  param('id').isUUID().withMessage('El id debe ser un uuid valido'),
  validate
], getEvento);

eventoRouter.post('/', [
  body('nombre').notEmpty().withMessage('El nombre del evento es obligatorio'),
  body('clienteId').isUUID().withMessage('El clienteId debe ser un uuid valido'),
  validate
], postEvento);

eventoRouter.patch('/:id', [
  param('id').isUUID().withMessage('El id debe ser un uuid valido'),
  validate
], patchEvento);

eventoRouter.delete('/:id', [
  param('id').isUUID().withMessage('El id debe ser un uuid valido'),
  validate
], deleteEvento);
