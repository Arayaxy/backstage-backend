import {
  findEventos,
  findEventoById,
  createEvento,
  updateEvento,
  removeEvento,
} from '../services/evento.service.js';
import { mapPrismaError } from '../lib/prismaErrors.js';

export const getEventos = async (_req, res, next) => {
  try {
    const eventos = await findEventos({ includeCliente: true });
    res.json({ ok: true, data: eventos, meta: { total: eventos.length } });
  } catch (err) { next(err); }
};

export const getEvento = async (req, res, next) => {
  try {
    const evento = await findEventoById(req.params.id, { includeCliente: true });
    if (!evento) {
      const err = new Error('Evento no encontrado');
      err.status = 404;
      return next(err);
    }
    res.json({ ok: true, data: evento });
  } catch (err) { next(err); }
};

export const postEvento = async (req, res, next) => {
  try {
    const evento = await createEvento(req.body);
    res.status(201).json({ ok: true, data: evento });
  } catch (err) { next(mapPrismaError(err)); }
};

export const patchEvento = async (req, res, next) => {
  try {
    const evento = await updateEvento(req.params.id, req.body);
    res.json({ ok: true, data: evento });
  } catch (err) { next(mapPrismaError(err)); }
};

export const deleteEvento = async (req, res, next) => {
  try {
    const evento = await removeEvento(req.params.id);
    res.json({ ok: true, data: evento, message: 'Evento eliminado' });
  } catch (err) { next(mapPrismaError(err)); }
};
