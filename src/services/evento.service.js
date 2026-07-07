import prisma from '../lib/prisma.js';

export const findEventos = ({ includeCliente = false } = {}) => {
  return prisma.evento.findMany({
    include: includeCliente ? { cliente: true } : undefined,
  });
};

export const findEventoById = (id, { includeCliente = false } = {}) => {
  return prisma.evento.findUnique({
    where: { id },
    include: includeCliente ? { cliente: true } : undefined,
  });
};

export const createEvento = (data) => {
  return prisma.evento.create({
    data: {
      nombre: data.nombre,
      descripcion: data.descripcion,
      completado: data.completado,
      clienteId: data.clienteId,
    },
  });
};

export const updateEvento = (id, data) => {
  return prisma.evento.update({
    where: { id },
    data: {
      ...(data.nombre !== undefined && { nombre: data.nombre }),
      ...(data.descripcion !== undefined && { descripcion: data.descripcion }),
      ...(data.completado !== undefined && { completado: data.completado }),
      ...(data.clienteId !== undefined && { clienteId: data.clienteId }),
    },
  });
};

export const removeEvento = (id) => {
  return prisma.evento.delete({ where: { id } });
};
