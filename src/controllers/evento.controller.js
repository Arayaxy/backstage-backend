import prisma from '../lib/prisma.js';

export const getEventos = async (req, res, next) => {
  try {
    const { ciudad, tipo_evento } = req.query;

    let eventos;
    if (ciudad || tipo_evento) {
      const conditions = [];
      const params = [];
      if (ciudad) { conditions.push(`unaccent(e.ciudad) ILIKE unaccent($${params.length + 1})`); params.push(`%${ciudad}%`); }
      if (tipo_evento) { conditions.push(`unaccent(e.tipo_evento) ILIKE unaccent($${params.length + 1})`); params.push(`%${tipo_evento}%`); }
      eventos = await prisma.$queryRawUnsafe(
        `SELECT e.* FROM eventos e WHERE ${conditions.join(' AND ')}`,
        ...params
      );
    } else {
      eventos = await prisma.evento.findMany();
    }

    res.status(200).json({ ok: true, data: eventos });
  } catch (error) {
    next(error);
  }
};

export const getEvento = async (req, res, next) => {
  try {
    const evento = await prisma.evento.findUnique({ where: { id_evento: req.params.id } });

    if (!evento)
      return res.status(404).json({ ok: false, msg: 'Evento no encontrado' });

    res.status(200).json({ ok: true, data: evento });
  } catch (error) {
    next(error);
  }
};

export const postEvento = async (req, res, next) => {
  try {
    const { nombre_evento, ciudad, lugar_confirmado, fecha_inicio, fecha_fin, numero_personas, tipo_evento, nota, clienteId, estadoId } = req.body;

    const nuevo = await prisma.evento.create({
      data: {
        nombre_evento, clienteId, estadoId,
        ciudad: ciudad || '',
        lugar_confirmado: lugar_confirmado || '',
        fecha_inicio: fecha_inicio || '',
        fecha_fin: fecha_fin || '',
        tipo_evento: tipo_evento || '',
        nota: nota || '',
        numero_personas: parseInt(numero_personas, 10) || 0,
      },
    });

    res.status(201).json({ ok: true, data: nuevo });
  } catch (error) {
    if (error.code === 'P2003')
      return res.status(400).json({ ok: false, msg: 'El clienteId o estadoId no existen' });
    next(error);
  }
};

export const patchEvento = async (req, res, next) => {
  try {
    const exists = await prisma.evento.findUnique({ where: { id_evento: req.params.id } });
    if (!exists)
      return res.status(404).json({ ok: false, msg: 'Evento no encontrado' });

    const { nombre_evento, ciudad, lugar_confirmado, fecha_inicio, fecha_fin, numero_personas, tipo_evento, nota, clienteId, estadoId } = req.body;

    const data = {};
    if (nombre_evento !== undefined) data.nombre_evento = nombre_evento;
    if (ciudad !== undefined) data.ciudad = ciudad;
    if (lugar_confirmado !== undefined) data.lugar_confirmado = lugar_confirmado;
    if (fecha_inicio !== undefined) data.fecha_inicio = fecha_inicio;
    if (fecha_fin !== undefined) data.fecha_fin = fecha_fin;
    if (tipo_evento !== undefined) data.tipo_evento = tipo_evento;
    if (nota !== undefined) data.nota = nota;
    if (clienteId !== undefined) data.clienteId = clienteId;
    if (estadoId !== undefined) data.estadoId = estadoId;
    if (numero_personas !== undefined) data.numero_personas = parseInt(numero_personas, 10) || 0;

    const actualizado = await prisma.evento.update({
      where: { id_evento: req.params.id },
      data,
    });

    res.status(200).json({ ok: true, data: actualizado });
  } catch (error) {
    if (error.code === 'P2003')
      return res.status(400).json({ ok: false, msg: 'El clienteId o estadoId no existen' });
    next(error);
  }
};

export const deleteEvento = async (req, res, next) => {
  try {
    const exists = await prisma.evento.findUnique({ where: { id_evento: req.params.id } });
    if (!exists)
      return res.status(404).json({ ok: false, msg: 'Evento no encontrado' });

    await prisma.evento.delete({ where: { id_evento: req.params.id } });

    res.status(200).json({ ok: true, msg: 'Evento eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};
