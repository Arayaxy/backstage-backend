import prisma from '../lib/prisma.js';

export const getPonentes = async (req, res, next) => {
  try {
    const { sector } = req.query;

    let ponentes;
    if (sector) {
      ponentes = await prisma.$queryRaw`
        SELECT * FROM ponentes
        WHERE unaccent(sector) ILIKE unaccent(${'%' + sector + '%'})
      `;
    } else {
      ponentes = await prisma.ponente.findMany();
    }

    res.status(200).json({ ok: true, data: ponentes });
  } catch (error) {
    next(error);
  }
};

export const getPonente = async (req, res, next) => {
  try {
    const ponente = await prisma.ponente.findUnique({ where: { id_ponente: req.params.id } });

    if (!ponente)
      return res.status(404).json({ ok: false, msg: 'Ponente no encontrado' });

    res.status(200).json({ ok: true, data: ponente });
  } catch (error) {
    next(error);
  }
};

export const postPonente = async (req, res, next) => {
  try {
    const { nombre_ponente, docu_identificacion, email, sector, telefono, empresa, cargo } = req.body;
    const foto_link = req.file ? req.file.path : '';

    const nuevo = await prisma.ponente.create({
      data: {
        nombre_ponente,
        docu_identificacion: docu_identificacion || '',
        email,
        sector: sector || '',
        telefono: telefono || '',
        foto_link,
        cv_link: '',
        empresa: empresa || '',
        cargo: cargo || '',
      },
    });

    res.status(201).json({ ok: true, data: nuevo });
  } catch (error) {
    if (error.code === 'P2002')
      return res.status(409).json({ ok: false, msg: 'El email ya está registrado' });
    next(error);
  }
};

export const patchPonente = async (req, res, next) => {
  try {
    const exists = await prisma.ponente.findUnique({ where: { id_ponente: req.params.id } });
    if (!exists)
      return res.status(404).json({ ok: false, msg: 'Ponente no encontrado' });

    const { nombre_ponente, docu_identificacion, email, sector, telefono, empresa, cargo } = req.body;
    const foto_link = req.file ? req.file.path : undefined;

    const actualizado = await prisma.ponente.update({
      where: { id_ponente: req.params.id },
      data: {
        nombre_ponente,
        docu_identificacion: docu_identificacion || '',
        email,
        sector: sector || '',
        telefono: telefono || '',
        ...(foto_link !== undefined && { foto_link }),
        empresa: empresa || '',
        cargo: cargo || '',
      },
    });

    res.status(200).json({ ok: true, data: actualizado });
  } catch (error) {
    if (error.code === 'P2002')
      return res.status(409).json({ ok: false, msg: 'El email ya está registrado' });
    next(error);
  }
};

export const deletePonente = async (req, res, next) => {
  try {
    const exists = await prisma.ponente.findUnique({ where: { id_ponente: req.params.id } });
    if (!exists)
      return res.status(404).json({ ok: false, msg: 'Ponente no encontrado' });

    await prisma.ponente.delete({ where: { id_ponente: req.params.id } });

    res.status(200).json({ ok: true, msg: 'Ponente eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};
