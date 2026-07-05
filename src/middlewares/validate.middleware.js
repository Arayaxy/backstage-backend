import { validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req).formatWith(({ msg: detail, type, path, fields }) => ({
    path,
    type,
    'title': 'Atributo no válido',
    detail,
    fields,
  }));

  if (!errors.isEmpty())
    return res.status(400).json({
      message: 'Error de validación',
      details: errors.array()
    });
  next();
};
