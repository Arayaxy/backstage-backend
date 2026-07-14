import {
  findEventos,
  findEventoById,
  createEvento,
  updateEvento,
  removeEvento,
} from '../services/evento.service.js';
import { mapPrismaError } from '../lib/prismaErrors.js';

export const getEventos = async (req, res, next) => {
  try {
    const { ciudad, tipoEvento, estado } = req.query;

    const eventos = await findEventos({
      includeCliente: true,
      includeSala: true,
      includePresupuesto: true,
      includePonencias: true,
      where: {
        ciudad: { contains: ciudad, mode: 'insensitive' },
        tipoEvento: { contains: tipoEvento, mode: 'insensitive' },
        estado,
      },
    });
    res.json({ ok: true, data: eventos, meta: { total: eventos.length } });
  } catch (err) { next(err); }
};

export const getEvento = async (req, res, next) => {
  try {
    const evento = await findEventoById(req.params.id, {
      includeCliente: true,
      includeSala: true,
      includePresupuesto: true,
      includePonencias: true,
    });
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
    const deleted = await removeEvento(req.params.id);
    res.json({ ok: true, data: deleted, message: 'Evento eliminado' });
  } catch (err) { next(mapPrismaError(err)); }
};
