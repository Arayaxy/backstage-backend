import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'tripulaciones',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'ppt', 'pptx', 'doc', 'docx'],
    resource_type: 'auto',
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});
