import { uploadImagenPonente, uploadPresentacion, uploadDocumento } from '../config/upload.js';

// Adapta Multer para enviar cualquier error al manejador global.
const runUpload = uploader => (req, res, next) => {
  uploader(req, res, error => {
    if (error) return next(error);
    return next();
  });
};

// Cada middleware recibe un único archivo desde el campo "file".
export const imagenPonente = runUpload(uploadImagenPonente.single('file'));
export const presentacion = runUpload(uploadPresentacion.single('file'));
export const documento = runUpload(uploadDocumento.single('file'));

// Guarda temporalmente la última versión de cada presentación en memoria.
const versionTracker = new Map();

export const computeVersion = (req, res, next) => {
  // Obtiene los identificadores enviados como parámetros de consulta.
  const { evento_id, ponente_id } = req.query;

  // Ambos identificadores son necesarios para construir el nombre del archivo.
  if (!evento_id || !ponente_id) {
    return res.status(400).json({ ok: false, message: 'Faltan evento_id o ponente_id' });
  }

  // Crea una clave única para la presentación del ponente en ese evento.
  const key = `${evento_id}-${ponente_id}`;
  const version = (versionTracker.get(key) || 0) + 1;
  versionTracker.set(key, version);

  // Cloudinary utilizará este valor como identificador público del archivo.
  req.customPublicId = `${evento_id}-${ponente_id}-v${version}`;
  return next();
};
