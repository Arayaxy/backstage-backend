import {
  findPonencias,
  findPonenciaById,
  createPonencia,
  updatePonencia,
  removePonencia,
} from '../services/ponencia.service.js';
import { mapPrismaError } from '../lib/prismaErrors.js';

export const getPonencias = async (req, res, next) => {
  try {
    const { idPonente, idEvento } = req.query;

    const ponencias = await findPonencias({
      includePonente: true,
      includeEvento: true,
      where: { idPonente, idEvento },
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

const updatePonenciaFile = async (req, res, next, fieldName) => {
  try {
    if (!req.file?.path) {
      const err = new Error('No se ha recibido ningun archivo');
      err.status = 400;
      return next(err);
    }

    const ponencia = await updatePonencia(req.params.id, {
      [fieldName]: req.file.path,
    });

    res.json({ ok: true, data: ponencia });
  } catch (err) { next(mapPrismaError(err)); }
};

export const uploadPonenciaPresentacion = (req, res, next) => {
  return updatePonenciaFile(req, res, next, 'presentacionLink');
};

export const uploadPonenciaBilleteIda = (req, res, next) => {
  return updatePonenciaFile(req, res, next, 'billeteIdaLink');
};

export const uploadPonenciaBilleteVuelta = (req, res, next) => {
  return updatePonenciaFile(req, res, next, 'billeteVueltaLink');
};

export const deletePonencia = async (req, res, next) => {
  try {
    const deleted = await removePonencia(req.params.id);
    res.json({ ok: true, data: deleted, message: 'Ponencia eliminada' });
  } catch (err) { next(mapPrismaError(err)); }
};
