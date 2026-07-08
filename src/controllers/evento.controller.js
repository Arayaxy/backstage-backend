export const getEventos = (req, res) => {
  res.status(200).json({ ok: true, msg: 'Has intentado acceder a obtener todos los eventos' });
};

export const getEvento = (req, res) => {
  res.status(200).json({ ok: true, msg: 'Has intentado acceder a obtener un evento' });
};

export const postEvento = (req, res) => {
  res.status(200).json({ ok: true, msg: 'Has intentado acceder a crear un evento' });
};

export const patchEvento = (req, res) => {
  res.status(200).json({ ok: true, msg: 'Has intentado acceder a actualizar un evento' });
};

export const deleteEvento = (req, res) => {
  res.status(200).json({ ok: true, msg: 'Has intentado acceder a eliminar un evento' });
};
