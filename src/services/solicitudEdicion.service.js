import prisma from '../lib/prisma.js';

export const findSolicitudesEdicion = ({ includePonencia = false, where } = {}) => {
  return prisma.solicitudEdicion.findMany({
    where,
    include: {
      ...(includePonencia && { ponencia: true }),
    },
  });
};

export const findSolicitudEdicionById = (id, { includePonencia = false } = {}) => {
  return prisma.solicitudEdicion.findUnique({
    where: { id },
    include: {
      ...(includePonencia && { ponencia: true }),
    },
  });
};

export const createSolicitudEdicion = (data) => {
  return prisma.solicitudEdicion.create({ data });
};

export const updateSolicitudEdicion = (id, data) => {
  return prisma.solicitudEdicion.update({ where: { id }, data });
};

export const removeSolicitudEdicion = (id) => {
  return prisma.solicitudEdicion.delete({ where: { id } });
};
