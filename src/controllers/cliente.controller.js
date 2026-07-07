import {
  findClientes,
  findClienteById,
  createCliente,
  updateCliente,
  removeCliente,
} from '../services/cliente.service.js';
import { mapPrismaError } from '../lib/prismaErrors.js';

export const getClientes = async (_req, res, next) => {
  try {
    const clientes = await findClientes({ includeEventos: true });
    res.json({ ok: true, data: clientes, meta: { total: clientes.length } });
  } catch (err) { next(err); }
};

export const getCliente = async (req, res, next) => {
  try {
    const cliente = await findClienteById(req.params.id, { includeEventos: true });
    if (!cliente) {
      const err = new Error('Cliente no encontrado');
      err.status = 404;
      return next(err);
    }
    res.json({ ok: true, data: cliente });
  } catch (err) { next(err); }
};

export const postCliente = async (req, res, next) => {
  try {
    const cliente = await createCliente(req.body);
    res.status(201).json({ ok: true, data: cliente });
  } catch (err) { next(mapPrismaError(err)); }
};

export const patchCliente = async (req, res, next) => {
  try {
    const cliente = await updateCliente(req.params.id, req.body);
    res.json({ ok: true, data: cliente });
  } catch (err) { next(mapPrismaError(err)); }
};

export const deleteCliente = async (req, res, next) => {
  try {
    const cliente = await removeCliente(req.params.id);
    res.json({ ok: true, data: cliente, message: 'Cliente eliminado' });
  } catch (err) { next(mapPrismaError(err)); }
};
