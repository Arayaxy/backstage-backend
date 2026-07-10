import prisma from '../lib/prisma.js';

export const findPonentes = ({ includePonencias = false, where } = {}) => {
  return prisma.ponente.findMany({
    where,
    include: includePonencias ? { eventosPonente: true } : undefined,
  });
};

export const findPonenteById = (id, { includePonencias = false } = {}) => {
  return prisma.ponente.findUnique({
    where: { id },
    include: includePonencias ? { eventosPonente: true } : undefined,
  });
};

export const createPonente = (data) => {
  return prisma.ponente.create({ data });
};

export const updatePonente = (id, data) => {
  return prisma.ponente.update({ where: { id }, data });
};

export const deletePonente = (id) => {
  return prisma.ponente.delete({ where: { id } });
};
