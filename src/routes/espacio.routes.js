import { Router } from 'express';
import { body, param } from 'express-validator';

import { validarToken } from '../middlewares/auth.middleware.js';
import { validarRol } from '../middlewares/validarRol.js';
import { validate } from '../middlewares/validate.middleware.js';

import {
  getEspacios,
  getEspacio,
  postEspacio,
  patchEspacio,
  deleteEspacio,
} from '../controllers/espacio.controller.js';

export const espacioRouter = Router();

//espacioRouter.use(validarToken, validarRol('admin'));

espacioRouter.get('/', getEspacios);

espacioRouter.get('/:id', [
  param('id').isUUID().withMessage('El id debe ser un uuid valido'),
  validate
], getEspacio);

espacioRouter.post('/', [
  body('nombre').notEmpty().withMessage('El nombre del espacio es obligatorio'),
  validate
], postEspacio);

espacioRouter.patch('/:id', [
  param('id').isUUID().withMessage('El id debe ser un uuid valido'),
  validate
], patchEspacio);

espacioRouter.delete('/:id', [
  param('id').isUUID().withMessage('El id debe ser un uuid valido'),
  validate
], deleteEspacio);
