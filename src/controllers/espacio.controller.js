export const getEspacios = (req, res) => {
  res.status(200).json({ ok: true, msg: 'Has intentado acceder a obtener todos los espacios' });
};

export const getEspacio = (req, res) => {
  res.status(200).json({ ok: true, msg: 'Has intentado acceder a obtener un espacio' });
};

export const postEspacio = (req, res) => {
  res.status(200).json({ ok: true, msg: 'Has intentado acceder a crear un espacio' });
};

export const patchEspacio = (req, res) => {
  res.status(200).json({ ok: true, msg: 'Has intentado acceder a actualizar un espacio' });
};

export const deleteEspacio = (req, res) => {
  res.status(200).json({ ok: true, msg: 'Has intentado acceder a eliminar un espacio' });
};
