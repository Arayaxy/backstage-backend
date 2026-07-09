import { Router } from 'express';
import { uploadFile } from '../controllers/upload.controller.js';
import { imagenPonente, presentacion, cv, billete, documento, computeVersion } from '../middlewares/upload.middleware.js';
import { authenticate, authorize, validateInputs } from '../middlewares/index.js';
import {
  imagenPonenteValidation,
  presentacionValidation,
  cvValidation,
  billeteValidation,
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
  '/ponente/cv',
  cvValidation,
  validateInputs,
  cv,
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
uploadRouter.post(
  '/ponente/billete',
  billeteValidation,
  validateInputs,
  billete,
  uploadFile
);
uploadRouter.post('/documento', documento, uploadFile);
