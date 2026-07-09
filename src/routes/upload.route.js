import { Router } from 'express';
import { uploadFile } from '../controllers/upload.controller.js';
import { imagenPonente, presentacion, documento, computeVersion } from '../middlewares/upload.middleware.js';
import { authenticate, authorize, validateInputs } from '../middlewares/index.js';
import {
  imagenPonenteValidation,
  presentacionValidation,
} from '../validations/upload.validation.js';

export const uploadRouter = Router();

uploadRouter.use(authenticate, authorize('admin'));

uploadRouter.post(
  '/ponente/imagen',
  imagenPonenteValidation,
  validateInputs,
  imagenPonente,
  uploadFile
);
uploadRouter.post(
  '/ponente/presentacion',
  presentacionValidation,
  validateInputs,
  computeVersion,
  presentacion,
  uploadFile
);
uploadRouter.post('/documento', documento, uploadFile);
