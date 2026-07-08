import { Router } from 'express';
import { uploadFile } from '../controllers/upload.controller.js';
import { imagenPonente, presentacion, documento, computeVersion } from '../middlewares/upload.middleware.js';
import { verifyAdmin } from '../middlewares/auth.middleware.js';

export const uploadRouter = Router();

uploadRouter.post('/ponente/imagen', verifyAdmin, imagenPonente, uploadFile);
uploadRouter.post('/ponente/presentacion', verifyAdmin, computeVersion, presentacion, uploadFile);
uploadRouter.post('/documento', verifyAdmin, documento, uploadFile);
