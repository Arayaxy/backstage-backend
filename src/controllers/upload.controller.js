export const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ ok: false, message: 'No se envió ningún archivo' });
  }

  return res.json({
    ok: true,
    file: {
      filename: req.file.filename,
      originalname: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
    },
  });
};
