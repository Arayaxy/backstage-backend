import {
  findPonentes,
  findPonenteById,
  createPonente,
  updatePonente,
  deletePonente,
} from '../services/ponente.service.js';
import { mapPrismaError } from '../lib/prismaErrors.js';

export const getPonentes = async (req, res, next) => {
  try {
    const { sector } = req.query;
    const where = {};
    if (sector) where.sector = { contains: sector, mode: 'insensitive' };

    const ponentes = await findPonentes({
      includePonencias: true,
      where: Object.keys(where).length ? where : undefined,
    });
    res.json({ ok: true, data: ponentes, meta: { total: ponentes.length } });
  } catch (err) { next(err); }
};

export const getPonenteByTelegram = async (req, res, next) => {
  try {
    // Se consulta con SQL parametrizado (no via modelo Prisma) para que el resto de
    // endpoints de ponentes no dependan de que la columna telegram_user_id exista ya.
    // Cuando se aplique la migración que la añade, esto funciona sin tocar nada;
    // mientras tanto responde 501 con un mensaje claro en vez de un 500 opaco.
    const ponentes = await prisma.$queryRaw`
      SELECT * FROM ponentes
      WHERE telegram_user_id = ${req.params.telegramUserId}
    `;

    if (!ponentes.length)
      return res.status(404).json({ ok: false, message: 'Ponente no encontrado', error: [{ type: 'not_found', title: 'Ponente no encontrado', detail: 'Ningún ponente tiene vinculado ese usuario de Telegram' }] });

    res.status(200).json({ ok: true, data: ponentes[0] });
  } catch (error) {
    // 42703 = undefined_column en Postgres: la migración de telegram_user_id aún no se aplicó.
    if (error.meta?.code === '42703' || String(error.message).includes('telegram_user_id'))
      return res.status(501).json({ ok: false, message: 'Función pendiente de migración', error: [{ type: 'not_implemented', title: 'Columna telegram_user_id no existe todavía', detail: 'Añadir telegram_user_id (String? @unique) al modelo Ponente y migrar. Ver contrato v3 §5.' }] });
    next(error);
  }
};

export const getPonente = async (req, res, next) => {
  try {
    const ponente = await findPonenteById(req.params.id, { includePonencias: true });
    if (!ponente) {
      const err = new Error('Ponente no encontrado');
      err.status = 404;
      return next(err);
    }
    res.json({ ok: true, data: ponente });
  } catch (err) { next(err); }
};

export const postPonente = async (req, res, next) => {
  try {
    const ponente = await createPonente(req.body);
    res.status(201).json({ ok: true, data: ponente });
  } catch (err) { next(mapPrismaError(err)); }
};

export const patchPonente = async (req, res, next) => {
  try {
    const ponente = await updatePonente(req.params.id, req.body);
    res.json({ ok: true, data: ponente });
  } catch (err) { next(mapPrismaError(err)); }
};

export const deletePonente = async (req, res, next) => {
  try {
    const deleted = await deletePonente(req.params.id);
    res.json({ ok: true, data: deleted, message: 'Ponente eliminado' });
  } catch (err) { next(mapPrismaError(err)); }
};
