import prisma from '../lib/prisma.js';

export const findEspacios = ({ includeSalas = false, where } = {}) => {
  return prisma.espacio.findMany({
    where,
    include: includeSalas ? { salas: true } : undefined,
  });
};

export const findEspacioById = (id, { includeSalas = false } = {}) => {
  return prisma.espacio.findUnique({
    where: { id },
    include: includeSalas ? { salas: true } : undefined,
  });
};

export const createEspacio = (data) => {
  return prisma.espacio.create({ data });
};

export const updateEspacio = (id, data) => {
  return prisma.espacio.update({ where: { id }, data });
};

export const deleteEspacio = (id) => {
  return prisma.espacio.delete({ where: { id } });
};

export const buscarPorCapacidad = (min, max) => {
  return Promise.all([
    prisma.espacio.findMany({
      where: { aforo: { gte: min, lte: max } },
      orderBy: { aforo: 'desc' },
    }),
    prisma.sala.findMany({
      where: { capacidadMaxSala: { gte: min, lte: max } },
      include: { espacio: { select: { id: true, nombreEspacio: true, aforo: true } } },
      orderBy: { capacidadMaxSala: 'desc' },
    }),
  ]);
};
