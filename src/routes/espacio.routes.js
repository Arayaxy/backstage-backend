import { Router } from 'express';
import { body, param, query } from 'express-validator';

import { validarToken } from '../middlewares/auth.middleware.js';
import { validarRol } from '../middlewares/validarRol.js';
import { validate } from '../middlewares/validate.middleware.js';

import {
  getEspacios,
  getEspacio,
  postEspacio,
  patchEspacio,
  deleteEspacio,
  buscarPorCapacidad,
} from '../controllers/espacio.controller.js';

export const espacioRouter = Router();

//espacioRouter.use(validarToken, validarRol('admin'));

espacioRouter.get('/buscar', [
  query('min').optional().isInt({ min: 0 }),
  query('max').optional().isInt({ min: 0 }),
  validate
], buscarPorCapacidad);

espacioRouter.get('/', [
  query('ciudad').optional().isString(),
  query('aforo').optional().isInt({ min: 0 }),
  validate
], getEspacios);

espacioRouter.get('/:id', [
  param('id').isUUID(),
  validate
], getEspacio);

espacioRouter.post('/', [
  body('nombre_espacio').notEmpty(),
  validate
], postEspacio);

espacioRouter.patch('/:id', [
  param('id').isUUID(),
  validate
], patchEspacio);

espacioRouter.delete('/:id', [
  param('id').isUUID(),
  validate
], deleteEspacio);
