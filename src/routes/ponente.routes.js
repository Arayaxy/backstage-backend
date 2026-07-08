import { Router } from 'express';
import { body, param } from 'express-validator';

import { validarToken } from '../middlewares/auth.middleware.js';
import { validarRol } from '../middlewares/validarRol.js';
import { validate } from '../middlewares/validate.middleware.js';

import {
  getPonentes,
  getPonente,
  postPonente,
  patchPonente,
  deletePonente,
} from '../controllers/ponente.controller.js';

export const ponenteRouter = Router();

// ponenteRouter.use(validarToken, validarRol('admin'));

ponenteRouter.get('/', getPonentes);

ponenteRouter.get('/:id', [
  param('id').isUUID().withMessage('El id debe ser un uuid valido'),
  validate
], getPonente);

ponenteRouter.post('/', [
  body('nombre').notEmpty().withMessage('El nombre del ponente es obligatorio'),
  validate
], postPonente);

ponenteRouter.patch('/:id', [
  param('id').isUUID().withMessage('El id debe ser un uuid valido'),
  validate
], patchPonente);

ponenteRouter.delete('/:id', [
  param('id').isUUID().withMessage('El id debe ser un uuid valido'),
  validate
], deletePonente);
