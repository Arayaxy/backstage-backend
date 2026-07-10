import prisma from '../lib/prisma.js';

export const findEventos = ({ includeCliente = false, includeEstado = false, includeSala = false, includePresupuesto = false, includePonencias = false, where } = {}) => {
  return prisma.evento.findMany({
    where,
    include: {
      ...(includeCliente && { cliente: true }),
      ...(includeEstado && { estado: true }),
      ...(includeSala && { sala: true }),
      ...(includePresupuesto && { presupuesto: true }),
      ...(includePonencias && { ponencias: true }),
    },
  });
};

export const findEventoById = (id, { includeCliente = false, includeEstado = false, includeSala = false, includePresupuesto = false, includePonencias = false } = {}) => {
  return prisma.evento.findUnique({
    where: { id },
    include: {
      ...(includeCliente && { cliente: true }),
      ...(includeEstado && { estado: true }),
      ...(includeSala && { sala: true }),
      ...(includePresupuesto && { presupuesto: true }),
      ...(includePonencias && { ponencias: true }),
    },
  });
};

export const createEvento = (data) => {
  return prisma.evento.create({ data });
};

export const updateEvento = (id, data) => {
  return prisma.evento.update({ where: { id }, data });
};

export const deleteEvento = (id) => {
  return prisma.evento.delete({ where: { id } });
};
