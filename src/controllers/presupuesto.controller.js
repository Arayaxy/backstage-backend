import {
  findPresupuestos,
  findPresupuestoById,
  createPresupuesto,
  updatePresupuesto,
  removePresupuesto,
} from '../services/presupuesto.service.js';
import { mapPrismaError } from '../lib/prismaErrors.js';

export const getPresupuestos = async (req, res, next) => {
  try {
    const { estadoPresupuesto } = req.query;

    const presupuestos = await findPresupuestos({
      where: {
        estadoPresupuesto:
          estadoPresupuesto !== undefined
            ? estadoPresupuesto === 'true'
            : undefined,
      },
    });
    res.json({ ok: true, data: presupuestos, meta: { total: presupuestos.length } });
  } catch (err) { next(err); }
};

export const getPresupuesto = async (req, res, next) => {
  try {
    const presupuesto = await findPresupuestoById(req.params.id, { includeEvento: true });
    if (!presupuesto) {
      const err = new Error('Presupuesto no encontrado');
      err.status = 404;
      return next(err);
    }
    res.json({ ok: true, data: presupuesto });
  } catch (err) { next(err); }
};

export const postPresupuesto = async (req, res, next) => {
  try {
    const presupuesto = await createPresupuesto(req.body);
    res.status(201).json({ ok: true, data: presupuesto });
  } catch (err) { next(mapPrismaError(err)); }
};

export const patchPresupuesto = async (req, res, next) => {
  try {
    const presupuesto = await updatePresupuesto(req.params.id, req.body);
    res.json({ ok: true, data: presupuesto });
  } catch (err) { next(mapPrismaError(err)); }
};

export const deletePresupuesto = async (req, res, next) => {
  try {
    const deleted = await removePresupuesto(req.params.id);
    res.json({ ok: true, data: deleted, message: 'Presupuesto eliminado' });
  } catch (err) { next(mapPrismaError(err)); }
};
