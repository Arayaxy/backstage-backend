import prisma from '../lib/prisma.js';

export const findSalas = ({ includeEspacio = false, includeEventos = false, where } = {}) => {
  return prisma.sala.findMany({
    where,
    include: {
      ...(includeEspacio && { espacio: true }),
      ...(includeEventos && { eventos: true }),
    },
  });
};

export const findSalaById = (id, { includeEspacio = false, includeEventos = false } = {}) => {
  return prisma.sala.findUnique({
    where: { id },
    include: {
      ...(includeEspacio && { espacio: true }),
      ...(includeEventos && { eventos: true }),
    },
  });
};

export const createSala = (data) => {
  return prisma.sala.create({ data });
};

export const updateSala = (id, data) => {
  return prisma.sala.update({ where: { id }, data });
};

export const deleteSala = (id) => {
  return prisma.sala.delete({ where: { id } });
};
