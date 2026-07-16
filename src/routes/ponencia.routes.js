import { Router } from 'express';

import { authenticate, authorize, validateInputs } from '../middlewares/index.js';
import { uploadBillete, uploadPresentacion } from '../config/upload.js';
import {
  ponenciaIdValidation,
  createPonenciaValidation,
  updatePonenciaValidation,
} from '../validations/ponencia.validation.js';

import {
  getPonencias,
  getPonencia,
  postPonencia,
  patchPonencia,
  uploadPonenciaBilleteIda,
  uploadPonenciaBilleteVuelta,
  uploadPonenciaPresentacion,
  deletePonencia,
} from '../controllers/ponencia.controller.js';

export const ponenciaRouter = Router();

ponenciaRouter.use(authenticate, authorize('admin'));

ponenciaRouter.get('/', getPonencias);
ponenciaRouter.get('/:id', ponenciaIdValidation, validateInputs, getPonencia);
ponenciaRouter.post('/', createPonenciaValidation, validateInputs, postPonencia);
ponenciaRouter.patch('/:id', ponenciaIdValidation, updatePonenciaValidation, validateInputs, patchPonencia);
ponenciaRouter.post('/:id/presentacion', ponenciaIdValidation, validateInputs, uploadPresentacion.single('file'), uploadPonenciaPresentacion);
ponenciaRouter.post('/:id/billete-ida', ponenciaIdValidation, validateInputs, uploadBillete.single('file'), uploadPonenciaBilleteIda);
ponenciaRouter.post('/:id/billete-vuelta', ponenciaIdValidation, validateInputs, uploadBillete.single('file'), uploadPonenciaBilleteVuelta);
ponenciaRouter.delete('/:id', ponenciaIdValidation, validateInputs, deletePonencia);
