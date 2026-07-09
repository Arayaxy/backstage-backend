import { Router } from 'express';
import {
  getEventos,
  getEvento,
  postEvento,
  patchEvento,
  deleteEvento,
} from '../controllers/evento.controller.js';
import { authenticate, authorize, validateInputs } from '../middlewares/index.js';
import {
  createEventoValidation,
  eventoIdValidation,
  updateEventoValidation,
} from '../validations/evento.validation.js';

export const eventoRouter = Router();

eventoRouter.use(authenticate, authorize('admin'));

eventoRouter.get('/', getEventos);
eventoRouter.get('/:id', eventoIdValidation, validateInputs, getEvento);
eventoRouter.post('/', createEventoValidation, validateInputs, postEvento);
eventoRouter.patch(
  '/:id',
  eventoIdValidation,
  updateEventoValidation,
  validateInputs,
  patchEvento
);
eventoRouter.delete('/:id', eventoIdValidation, validateInputs, deleteEvento);
