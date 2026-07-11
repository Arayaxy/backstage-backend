import {
  findSalas,
  findSalaById,
  createSala,
  updateSala,
  removeSala,
} from '../services/sala.service.js';
import { mapPrismaError } from '../lib/prismaErrors.js';

export const getSalas = async (req, res, next) => {
  try {
    const { idEspacio } = req.query;

    const salas = await findSalas({
      includeEspacio: true,
      where: { idEspacio },
    });
    res.json({ ok: true, data: salas, meta: { total: salas.length } });
  } catch (err) { next(err); }
};

export const getSala = async (req, res, next) => {
  try {
    const sala = await findSalaById(req.params.id, { includeEspacio: true });
    if (!sala) {
      const err = new Error('Sala no encontrada');
      err.status = 404;
      return next(err);
    }
    res.json({ ok: true, data: sala });
  } catch (err) { next(err); }
};

export const postSala = async (req, res, next) => {
  try {
    const sala = await createSala(req.body);
    res.status(201).json({ ok: true, data: sala });
  } catch (err) { next(mapPrismaError(err)); }
};

export const patchSala = async (req, res, next) => {
  try {
    const sala = await updateSala(req.params.id, req.body);
    res.json({ ok: true, data: sala });
  } catch (err) { next(mapPrismaError(err)); }
};

export const deleteSala = async (req, res, next) => {
  try {
    const deleted = await removeSala(req.params.id);
    res.json({ ok: true, data: deleted, message: 'Sala eliminada' });
  } catch (err) { next(mapPrismaError(err)); }
};
