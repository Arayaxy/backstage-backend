import prisma from '../lib/prisma.js';

export const findUsuarios = ({ where } = {}) => {
  return prisma.usuario.findMany({ where });
};

export const findUsuarioById = (id) => {
  return prisma.usuario.findUnique({ where: { id } });
};

export const createUsuario = (data) => {
  return prisma.usuario.create({ data });
};

export const updateUsuario = (id, data) => {
  return prisma.usuario.update({ where: { id }, data });
};

export const removeUsuario = (id) => {
  return prisma.usuario.delete({ where: { id } });
};
