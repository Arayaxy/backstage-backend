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
      return res.status(404).json({ ok: false, message: 'Espacio no encontrado', error: [{ type: 'not_found', title: 'Espacio no encontrado', detail: 'No existe un espacio con ese ID' }] });

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
      return res.status(404).json({ ok: false, message: 'Espacio no encontrado' });

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

export const buscarPorCapacidad = async (req, res, next) => {
  try {
    const min = req.query.min ? parseInt(req.query.min, 10) : 0;
    const max = req.query.max ? parseInt(req.query.max, 10) : 999999;

    const [espacios, salas] = await Promise.all([
      prisma.$queryRaw`
        SELECT * FROM espacios
        WHERE CAST(aforo AS INTEGER) BETWEEN ${min} AND ${max}
        ORDER BY CAST(aforo AS INTEGER) DESC
      `,
      prisma.$queryRaw`
        SELECT s.*, e.nombre_espacio, e.aforo AS aforo_espacio
        FROM salas s
        JOIN espacios e ON e.id_espacio = s."espacioId"
        WHERE CAST(s.capacidad_max_sala AS INTEGER) BETWEEN ${min} AND ${max}
        ORDER BY CAST(s.capacidad_max_sala AS INTEGER) DESC
      `,
    ]);

    res.status(200).json({
      ok: true,
      data: {
        espacios,
        salas: salas.map(s => ({
          id_sala: s.id_sala,
          nombre_sala: s.nombre_sala,
          tipo_sala: s.tipo_sala,
          capacidad_max_sala: s.capacidad_max_sala,
          nota_sala: s.nota_sala,
          espacio: {
            id_espacio: s.espacioId,
            nombre_espacio: s.nombre_espacio,
            aforo: s.aforo_espacio,
          },
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEspacio = async (req, res, next) => {
  try {
    const exists = await prisma.espacio.findUnique({ where: { id_espacio: req.params.id } });
    if (!exists)
      return res.status(404).json({ ok: false, message: 'Espacio no encontrado', error: [{ type: 'not_found', title: 'Espacio no encontrado', detail: 'No existe un espacio con ese ID' }] });

    await prisma.espacio.delete({ where: { id_espacio: req.params.id } });

    res.status(200).json({ ok: true, message: 'Espacio eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};
