import {
  findUsuarios,
  findUsuarioById,
  createUsuario,
  updateUsuario,
  removeUsuario,
} from '../services/usuario.service.js';
import { mapPrismaError } from '../lib/prismaErrors.js';

export const getUsuarios = async (_req, res, next) => {
  try {
    const usuarios = await findUsuarios();
    res.json({ ok: true, data: usuarios, meta: { total: usuarios.length } });
  } catch (err) { next(err); }
};

export const getUsuario = async (req, res, next) => {
  try {
    const usuario = await findUsuarioById(req.params.id);
    if (!usuario) {
      const err = new Error('Usuario no encontrado');
      err.status = 404;
      return next(err);
    }
    res.json({ ok: true, data: usuario });
  } catch (err) { next(err); }
};

export const postUsuario = async (req, res, next) => {
  try {
    const usuario = await createUsuario(req.body);
    res.status(201).json({ ok: true, data: usuario });
  } catch (err) { next(mapPrismaError(err)); }
};

export const patchUsuario = async (req, res, next) => {
  try {
    const usuario = await updateUsuario(req.params.id, req.body);
    res.json({ ok: true, data: usuario });
  } catch (err) { next(mapPrismaError(err)); }
};

export const deleteUsuario = async (req, res, next) => {
  try {
    const deleted = await removeUsuario(req.params.id);
    res.json({ ok: true, data: deleted, message: 'Usuario eliminado' });
  } catch (err) { next(mapPrismaError(err)); }
};
