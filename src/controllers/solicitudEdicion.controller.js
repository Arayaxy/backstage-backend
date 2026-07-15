import {
  findSolicitudesEdicion,
  findSolicitudEdicionById,
  createSolicitudEdicion,
  updateSolicitudEdicion,
  removeSolicitudEdicion
} from '../services/solicitudEdicion.service.js';
import { mapPrismaError } from '../lib/prismaErrors.js';

export const getSolicitudesEdicion = async (req, res, next) => {
  try {
    const { estado } = req.query;

    const solicitudesEdicion = await findSolicitudesEdicion({
      includePonencia: true,
      where: { estado },
    });
    res.json({ ok: true, data: solicitudesEdicion, meta: { total: solicitudesEdicion.length } });
  } catch (err) { next(err); }
};

export const getSolicitudEdicion = async (req, res, next) => {
  try {
    const solicitudEdicion = await findSolicitudEdicionById(req.params.id, { includePonencia: true });
    if (!solicitudEdicion) {
      const err = new Error('Solicitud de edición no encontrada');
      err.status = 404;
      return next(err);
    }
    res.json({ ok: true, data: solicitudEdicion });
  } catch (err) { next(err); }
};

export const postSolicitudEdicion = async (req, res, next) => {
  try {
    const solicitudEdicion = await createSolicitudEdicion(req.body);
    res.status(201).json({ ok: true, data: solicitudEdicion });
  } catch (err) { next(mapPrismaError(err)); }
};

export const patchSolicitudEdicion = async (req, res, next) => {
  try {
    const solicitudEdicion = await updateSolicitudEdicion(req.params.id, req.body);
    res.json({ ok: true, data: solicitudEdicion });
  } catch (err) { next(mapPrismaError(err)); }
};

export const deleteSolicitudEdicion = async (req, res, next) => {
  try {
    const deleted = await removeSolicitudEdicion(req.params.id);
    res.json({ ok: true, data: deleted, message: 'Solicitud de edición eliminada' });
  } catch (err) { next(mapPrismaError(err)); }
};
