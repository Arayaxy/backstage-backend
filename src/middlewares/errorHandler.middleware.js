import multer from 'multer';
import { env } from '../config/env.js';

export const errorHandler = (err, req, res, _next) => {
  // Usa el estado del error o responde con 500 si no se especificó ninguno.
  let status = err.status || err.statusCode || 500;
  let message = err.message || 'Error interno del servidor';

  // Convierte los errores de subida de Multer en respuestas comprensibles.
  if (err instanceof multer.MulterError) {
    status = 400;
    message = err.code === 'LIMIT_FILE_SIZE'
      ? 'El archivo supera el tamaño máximo permitido'
      : 'No se pudo procesar el archivo';
  }

  // Registra información útil para encontrar el origen del error.
  console.error({
    time: new Date().toISOString(),
    method: req.method,
    route: req.originalUrl,
    message: err.message,
    ...(env.mode === 'development' && { stack: err.stack }),
  });

  // En producción no se muestran detalles de errores internos.
  const canExposeMessage = status < 500 || env.mode === 'development';

  return res.status(status).json({
    ok: false,
    message: canExposeMessage ? message : 'Error interno del servidor',
  });
};
