import prisma from '../lib/prisma.js';

export const findClientes = ({ includeEventos = false, where } = {}) => {
  return prisma.cliente.findMany({
    where,
    include: includeEventos ? { eventos: true } : undefined,
  });
};

export const findClienteById = (id, { includeEventos = false } = {}) => {
  return prisma.cliente.findUnique({
    where: { id },
    include: includeEventos ? { eventos: true } : undefined,
  });
};

export const createCliente = (data) => {
  return prisma.cliente.create({ data });
};

export const updateCliente = (id, data) => {
  return prisma.cliente.update({ where: { id }, data });
};

export const removeCliente = (id) => {
  return prisma.cliente.delete({ where: { id } });
};
