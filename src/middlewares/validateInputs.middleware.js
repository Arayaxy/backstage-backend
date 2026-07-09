import { validationResult } from 'express-validator';

// Comprueba si checkSchema ha encontrado errores en los datos recibidos.
export const validateInputs = (req, res, next) => {
  const errors = validationResult(req);

  // Si existen errores, detiene la petición y los devuelve por nombre de campo.
  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: errors.mapped(),
    });
  }

  // Si los datos son válidos, continúa hacia el controlador.
  return next();
};
