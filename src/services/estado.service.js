import prisma from '../lib/prisma.js';

export const findEstados = ({ includeEventos = false, where } = {}) => {
  return prisma.estado.findMany({
    where,
    include: includeEventos ? { eventos: true } : undefined,
  });
};

export const findEstadoById = (id, { includeEventos = false } = {}) => {
  return prisma.estado.findUnique({
    where: { id },
    include: includeEventos ? { eventos: true } : undefined,
  });
};

export const createEstado = (data) => {
  return prisma.estado.create({ data });
};

export const updateEstado = (id, data) => {
  return prisma.estado.update({ where: { id }, data });
};

export const deleteEstado = (id) => {
  return prisma.estado.delete({ where: { id } });
};
