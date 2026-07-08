import { Router } from 'express';
import { body, param, query } from 'express-validator';

import { validarToken } from '../middlewares/auth.middleware.js';
import { validarRol } from '../middlewares/validarRol.js';
import { validate } from '../middlewares/validate.middleware.js';

import {
  getClientes,
  getCliente,
  postCliente,
  patchCliente,
  deleteCliente,
} from '../controllers/cliente.controller.js';

export const clienteRouter = Router();

// clienteRouter.use(validarToken, validarRol('admin'));

clienteRouter.get('/', [
  query('sector').optional().isString(),
  query('ciudad').optional().isString(),
  validate
], getClientes);

clienteRouter.get('/:id', [
  param('id').isUUID(),
  validate
], getCliente);

clienteRouter.post('/', [
  body('cliente').notEmpty(),
  body('email').isEmail(),
  validate
], postCliente);

clienteRouter.patch('/:id', [
  param('id').isUUID(),
  body('email').optional().isEmail(),
  validate
], patchCliente);

clienteRouter.delete('/:id', [
  param('id').isUUID(),
  validate
], deleteCliente);
