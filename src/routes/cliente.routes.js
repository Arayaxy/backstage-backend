import { Router } from 'express';
import {
  getClientes,
  getCliente,
  postCliente,
  patchCliente,
  deleteCliente,
} from '../controllers/cliente.controller.js';
import { authenticate, authorize, validateInputs } from '../middlewares/index.js';
import {
  clienteIdValidation,
  createClienteValidation,
  updateClienteValidation,
} from '../validations/cliente.validation.js';

export const clienteRouter = Router();

clienteRouter.use(authenticate, authorize('admin'));

clienteRouter.get('/', getClientes);
clienteRouter.get('/:id', clienteIdValidation, validateInputs, getCliente);
clienteRouter.post('/', createClienteValidation, validateInputs, postCliente);
clienteRouter.patch(
  '/:id',
  clienteIdValidation,
  updateClienteValidation,
  validateInputs,
  patchCliente
);
clienteRouter.delete('/:id', clienteIdValidation, validateInputs, deleteCliente);
