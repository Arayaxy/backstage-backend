import { Router } from 'express';
import { body, param, query } from 'express-validator';

import { validarToken } from '../middlewares/auth.middleware.js';
import { validarRol } from '../middlewares/validarRol.js';
import { validate } from '../middlewares/validate.middleware.js';
import { uploadFile } from '../middlewares/upload.middleware.js';

import {
  getPonentes,
  getPonente,
  postPonente,
  patchPonente,
  deletePonente,
} from '../controllers/ponente.controller.js';

export const ponenteRouter = Router();

// ponenteRouter.use(validarToken, validarRol('admin'));

ponenteRouter.get('/', [
  query('sector').optional().isString(),
  validate
], getPonentes);

ponenteRouter.get('/:id', [
  param('id').isUUID(),
  validate
], getPonente);

ponenteRouter.post('/', uploadFile, [
  body('nombre_ponente').notEmpty(),
  body('email').isEmail(),
  validate
], postPonente);

ponenteRouter.patch('/:id', uploadFile, [
  param('id').isUUID(),
  body('email').optional().isEmail(),
  validate
], patchPonente);

ponenteRouter.delete('/:id', [
  param('id').isUUID(),
  validate
], deletePonente);
