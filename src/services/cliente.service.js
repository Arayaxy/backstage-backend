import prisma from '../lib/prisma.js';

export const findClientes = ({ includeEventos = false } = {}) => {
  return prisma.cliente.findMany({
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
  return prisma.cliente.create({
    data: {
      nombre: data.nombre,
      correo: data.correo,
    },
  });
};

export const updateCliente = (id, data) => {
  return prisma.cliente.update({
    where: { id },
    data: {
      ...(data.nombre !== undefined && { nombre: data.nombre }),
      ...(data.correo !== undefined && { correo: data.correo }),
    },
  });
};

export const removeCliente = (id) => {
  return prisma.cliente.delete({ where: { id } });
};
