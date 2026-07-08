import { Router } from 'express';
import { uploadFile } from '../controllers/upload.controller.js';
import { uploadFile as uploadMiddleware } from '../middlewares/upload.middleware.js';
// import { validarToken } from '../middlewares/auth.middleware.js';
// import { validarRol } from '../middlewares/validarRol.js';

export const uploadRouter = Router();

uploadRouter.post('/', /* validarToken, validarRol('admin'), */ uploadMiddleware, uploadFile);
