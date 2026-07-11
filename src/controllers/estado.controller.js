import {
  findEstados,
  findEstadoById,
  createEstado,
  updateEstado,
  removeEstado,
} from '../services/estado.service.js';
import { mapPrismaError } from '../lib/prismaErrors.js';

export const getEstados = async (_req, res, next) => {
  try {
    const estados = await findEstados();
    res.json({ ok: true, data: estados, meta: { total: estados.length } });
  } catch (err) { next(err); }
};

export const getEstado = async (req, res, next) => {
  try {
    const estado = await findEstadoById(req.params.id);
    if (!estado) {
      const err = new Error('Estado no encontrado');
      err.status = 404;
      return next(err);
    }
    res.json({ ok: true, data: estado });
  } catch (err) { next(err); }
};

export const postEstado = async (req, res, next) => {
  try {
    const estado = await createEstado(req.body);
    res.status(201).json({ ok: true, data: estado });
  } catch (err) { next(mapPrismaError(err)); }
};

export const patchEstado = async (req, res, next) => {
  try {
    const estado = await updateEstado(req.params.id, req.body);
    res.json({ ok: true, data: estado });
  } catch (err) { next(mapPrismaError(err)); }
};

export const deleteEstado = async (req, res, next) => {
  try {
    const deleted = await removeEstado(req.params.id);
    res.json({ ok: true, data: deleted, message: 'Estado eliminado' });
  } catch (err) { next(mapPrismaError(err)); }
};
