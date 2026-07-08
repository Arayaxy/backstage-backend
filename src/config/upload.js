import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

const makeStorage = (folder, formats) => new CloudinaryStorage({
  cloudinary,
  params: { folder, allowed_formats: formats, resource_type: 'auto' },
});

const storageImagen = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: 'ponentes/imagenes',
    public_id: req.query.ponente_id ? `${req.query.ponente_id}/perfil` : undefined,
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    resource_type: 'auto',
  }),
});

const storagePresentacion = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: 'ponentes/presentaciones',
    public_id: req.customPublicId || undefined,
    allowed_formats: ['pdf', 'ppt', 'pptx'],
    resource_type: 'auto',
  }),
});

const multerOptions = { limits: { fileSize: 30 * 1024 * 1024 } };

export const uploadImagenPonente = multer({ ...multerOptions, storage: storageImagen });
export const uploadPresentacion  = multer({ ...multerOptions, storage: storagePresentacion });
export const uploadDocumento = multer({ ...multerOptions, storage: makeStorage('documentos', ['pdf', 'ppt', 'pptx', 'doc', 'docx']) });
