import prisma from '../lib/prisma.js';

export const getClientes = async (req, res, next) => {
  try {
    const { sector, ciudad } = req.query;

    let clientes;
    if (sector || ciudad) {
      const conditions = [];
      const params = [];
      if (sector) { conditions.push(`unaccent(c.sector) ILIKE unaccent($${params.length + 1})`); params.push(`%${sector}%`); }
      if (ciudad) { conditions.push(`unaccent(c.ciudad) ILIKE unaccent($${params.length + 1})`); params.push(`%${ciudad}%`); }
      clientes = await prisma.$queryRawUnsafe(
        `SELECT c.* FROM clientes c WHERE ${conditions.join(' AND ')}`,
        ...params
      );
    } else {
      clientes = await prisma.cliente.findMany();
    }

    res.status(200).json({ ok: true, data: clientes });
  } catch (error) {
    next(error);
  }
};

export const getCliente = async (req, res, next) => {
  try {
    const cliente = await prisma.cliente.findUnique({ where: { id_cliente: req.params.id } });

    if (!cliente)
      return res.status(404).json({ ok: false, msg: 'Cliente no encontrado' });

    res.status(200).json({ ok: true, data: cliente });
  } catch (error) {
    next(error);
  }
};

export const postCliente = async (req, res, next) => {
  try {
    const { cliente, email, telefono, empresa, sector, ciudad } = req.body;

    const nuevo = await prisma.cliente.create({
      data: {
        cliente, email,
        telefono: telefono || '',
        empresa: empresa || '',
        sector: sector || '',
        ciudad: ciudad || '',
      },
    });

    res.status(201).json({ ok: true, data: nuevo });
  } catch (error) {
    if (error.code === 'P2002')
      return res.status(409).json({ ok: false, msg: 'El email ya está registrado' });
    next(error);
  }
};

export const patchCliente = async (req, res, next) => {
  try {
    const { cliente, email, telefono, empresa, sector, ciudad } = req.body;

    const exists = await prisma.cliente.findUnique({ where: { id_cliente: req.params.id } });
    if (!exists)
      return res.status(404).json({ ok: false, msg: 'Cliente no encontrado' });

    const actualizado = await prisma.cliente.update({
      where: { id_cliente: req.params.id },
      data: {
        cliente, email,
        telefono: telefono || '',
        empresa: empresa || '',
        sector: sector || '',
        ciudad: ciudad || '',
      },
    });

    res.status(200).json({ ok: true, data: actualizado });
  } catch (error) {
    if (error.code === 'P2002')
      return res.status(409).json({ ok: false, msg: 'El email ya está registrado' });
    next(error);
  }
};

export const deleteCliente = async (req, res, next) => {
  try {
    const exists = await prisma.cliente.findUnique({ where: { id_cliente: req.params.id } });
    if (!exists)
      return res.status(404).json({ ok: false, msg: 'Cliente no encontrado' });

    await prisma.cliente.delete({ where: { id_cliente: req.params.id } });

    res.status(200).json({ ok: true, msg: 'Cliente eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};
