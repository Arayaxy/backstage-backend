import prisma from '../lib/prisma.js';

export const getEspacios = async (req, res, next) => {
  try {
    const { ciudad } = req.query;

    let espacios;
    if (ciudad) {
      espacios = await prisma.$queryRaw`
        SELECT * FROM espacios
        WHERE unaccent(ciudad) ILIKE unaccent(${'%' + ciudad + '%'})
      `;
    } else {
      espacios = await prisma.espacio.findMany();
    }

    res.status(200).json({ ok: true, data: espacios });
  } catch (error) {
    next(error);
  }
};

export const getEspacio = async (req, res, next) => {
  try {
    const espacio = await prisma.espacio.findUnique({ where: { id_espacio: req.params.id } });

    if (!espacio)
      return res.status(404).json({ ok: false, msg: 'Espacio no encontrado' });

    res.status(200).json({ ok: true, data: espacio });
  } catch (error) {
    next(error);
  }
};

export const postEspacio = async (req, res, next) => {
  try {
    const { nombre_espacio, ciudad, direccion, aforo, nota, telefono_contacto, nombre_contacto, email_contacto } = req.body;

    const nuevo = await prisma.espacio.create({
      data: {
        nombre_espacio,
        ciudad: ciudad || '',
        direccion: direccion || '',
        aforo: aforo || '',
        nota: nota || '',
        telefono_contacto: telefono_contacto || '',
        nombre_contacto: nombre_contacto || '',
        email_contacto: email_contacto || '',
      },
    });

    res.status(201).json({ ok: true, data: nuevo });
  } catch (error) {
    next(error);
  }
};

export const patchEspacio = async (req, res, next) => {
  try {
    const exists = await prisma.espacio.findUnique({ where: { id_espacio: req.params.id } });
    if (!exists)
      return res.status(404).json({ ok: false, msg: 'Espacio no encontrado' });

    const { nombre_espacio, ciudad, direccion, aforo, nota, telefono_contacto, nombre_contacto, email_contacto } = req.body;

    const actualizado = await prisma.espacio.update({
      where: { id_espacio: req.params.id },
      data: {
        nombre_espacio,
        ciudad: ciudad || '',
        direccion: direccion || '',
        aforo: aforo || '',
        nota: nota || '',
        telefono_contacto: telefono_contacto || '',
        nombre_contacto: nombre_contacto || '',
        email_contacto: email_contacto || '',
      },
    });

    res.status(200).json({ ok: true, data: actualizado });
  } catch (error) {
    next(error);
  }
};

export const deleteEspacio = async (req, res, next) => {
  try {
    const exists = await prisma.espacio.findUnique({ where: { id_espacio: req.params.id } });
    if (!exists)
      return res.status(404).json({ ok: false, msg: 'Espacio no encontrado' });

    await prisma.espacio.delete({ where: { id_espacio: req.params.id } });

    res.status(200).json({ ok: true, msg: 'Espacio eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};
