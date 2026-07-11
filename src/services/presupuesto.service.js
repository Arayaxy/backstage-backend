import prisma from '../lib/prisma.js';

export const findPresupuestos = ({ includeEvento = false, where } = {}) => {
  return prisma.presupuesto.findMany({
    where,
    include: includeEvento ? { evento: true } : undefined,
  });
};

export const findPresupuestoById = (id, { includeEvento = false } = {}) => {
  return prisma.presupuesto.findUnique({
    where: { id },
    include: includeEvento ? { evento: true } : undefined,
  });
};

export const createPresupuesto = (data) => {
  return prisma.presupuesto.create({ data });
};

export const updatePresupuesto = (id, data) => {
  return prisma.presupuesto.update({ where: { id }, data });
};

export const removePresupuesto = (id) => {
  return prisma.presupuesto.delete({ where: { id } });
};
