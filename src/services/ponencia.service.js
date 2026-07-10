import prisma from '../lib/prisma.js';

export const findPonencias = ({ includePonente = false, includeEvento = false, where } = {}) => {
  return prisma.ponencia.findMany({
    where,
    include: {
      ...(includePonente && { ponente: true }),
      ...(includeEvento && { evento: true }),
    },
  });
};

export const findPonenciaById = (id, { includePonente = false, includeEvento = false } = {}) => {
  return prisma.ponencia.findUnique({
    where: { id },
    include: {
      ...(includePonente && { ponente: true }),
      ...(includeEvento && { evento: true }),
    },
  });
};

export const createPonencia = (data) => {
  return prisma.ponencia.create({ data });
};

export const updatePonencia = (id, data) => {
  return prisma.ponencia.update({ where: { id }, data });
};

export const deletePonencia = (id) => {
  return prisma.ponencia.delete({ where: { id } });
};
