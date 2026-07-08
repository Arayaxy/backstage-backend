import { Router } from 'express';
import { body, param } from 'express-validator';

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

clienteRouter.get('/', getClientes);

clienteRouter.get('/:id', [
  param('id').isUUID().withMessage('El id debe ser un uuid valido'),
  validate
], getCliente);

clienteRouter.post('/', [
  body('nombre').notEmpty().withMessage('El nombre del cliente es obligatorio'),
  body('correo').isEmail().withMessage('El correo debe ser un email valido'),
  validate
], postCliente);

clienteRouter.patch('/:id', [
  param('id').isUUID().withMessage('El id debe ser un uuid valido'),
  body('nombre').optional().notEmpty().withMessage('El nombre no puede estar vacio'),
  body('correo').optional().isEmail().withMessage('El correo debe ser un email valido'),
  validate
], patchCliente);

clienteRouter.delete('/:id', [
  param('id').isUUID().withMessage('El id debe ser un uuid valido'),
  validate
], deleteCliente);
