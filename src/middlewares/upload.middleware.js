import { uploadImagenPonente, uploadPresentacion, uploadDocumento } from '../config/upload.js';

export const imagenPonente = uploadImagenPonente.single('file');
export const presentacion = uploadPresentacion.single('file');
export const documento = uploadDocumento.single('file');

// In-memory version tracker (temporal, sin BD)
const versionTracker = new Map();

export const computeVersion = (req, res, next) => {
  const { evento_id, ponente_id } = req.query;

  if (!evento_id || !ponente_id) {
    return res.status(400).json({ ok: false, message: 'Faltan evento_id o ponente_id' });
  }

  const key = `${evento_id}-${ponente_id}`;
  const version = (versionTracker.get(key) || 0) + 1;
  versionTracker.set(key, version);

  req.customPublicId = `${evento_id}-${ponente_id}-v${version}`;
  next();
};
