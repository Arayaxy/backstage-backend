export const getPonentes = (req, res) => {
  res.status(200).json({ ok: true, msg: 'Has intentado acceder a obtener todos los ponentes' });
};

export const getPonente = (req, res) => {
  res.status(200).json({ ok: true, msg: 'Has intentado acceder a obtener un ponente' });
};

export const postPonente = (req, res) => {
  res.status(200).json({ ok: true, msg: 'Has intentado acceder a crear un ponente' });
};

export const patchPonente = (req, res) => {
  res.status(200).json({ ok: true, msg: 'Has intentado acceder a actualizar un ponente' });
};

export const deletePonente = (req, res) => {
  res.status(200).json({ ok: true, msg: 'Has intentado acceder a eliminar un ponente' });
};
