import {
  findPonencias,
  findPonenciaById,
  createPonencia,
  updatePonencia,
  deletePonencia,
} from '../services/ponencia.service.js';
import { mapPrismaError } from '../lib/prismaErrors.js';

export const getPonencias = async (req, res, next) => {
  try {
    const { idPonente } = req.query;
    const where = {};
    if (idPonente) where.idPonente = idPonente;

    const ponencias = await findPonencias({
      includePonente: true,
      includeEvento: true,
      where: Object.keys(where).length ? where : undefined,
    });
    res.json({ ok: true, data: ponencias, meta: { total: ponencias.length } });
  } catch (err) { next(err); }
};

export const getPonencia = async (req, res, next) => {
  try {
    const ponencia = await findPonenciaById(req.params.id, {
      includePonente: true,
      includeEvento: true,
    });
    if (!ponencia) {
      const err = new Error('Ponencia no encontrada');
      err.status = 404;
      return next(err);
    }
    res.json({ ok: true, data: ponencia });
  } catch (err) { next(err); }
};

export const postPonencia = async (req, res, next) => {
  try {
    const ponencia = await createPonencia(req.body);
    res.status(201).json({ ok: true, data: ponencia });
  } catch (err) { next(mapPrismaError(err)); }
};

export const patchPonencia = async (req, res, next) => {
  try {
    const ponencia = await updatePonencia(req.params.id, req.body);
    res.json({ ok: true, data: ponencia });
  } catch (err) { next(mapPrismaError(err)); }
};

export const deletePonencia = async (req, res, next) => {
  try {
    const deleted = await deletePonencia(req.params.id);
    res.json({ ok: true, data: deleted, message: 'Ponencia eliminada' });
  } catch (err) { next(mapPrismaError(err)); }
};
