export const getClientes = (req, res) => {
  res.status(200).json({ ok: true, msg: 'Has intentado acceder a obtener todos los clientes' });
};

export const getCliente = (req, res) => {
  res.status(200).json({ ok: true, msg: 'Has intentado acceder a obtener un cliente' });
};

export const postCliente = (req, res) => {
  res.status(200).json({ ok: true, msg: 'Has intentado acceder a crear un cliente' });
};

export const patchCliente = (req, res) => {
  res.status(200).json({ ok: true, msg: 'Has intentado acceder a actualizar un cliente' });
};

export const deleteCliente = (req, res) => {
  res.status(200).json({ ok: true, msg: 'Has intentado acceder a eliminar un cliente' });
};
