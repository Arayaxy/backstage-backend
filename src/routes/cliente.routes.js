import { Router } from 'express';
import {
  getClientes,
  getCliente,
  postCliente,
  patchCliente,
  deleteCliente,
} from '../controllers/cliente.controller.js';

export const clienteRouter = Router();

clienteRouter.get('/', getClientes);
clienteRouter.get('/:id', getCliente);
clienteRouter.post('/', postCliente);
clienteRouter.patch('/:id', patchCliente);
clienteRouter.delete('/:id', deleteCliente);
