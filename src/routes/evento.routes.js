import { Router } from 'express';
import {
  getEventos,
  getEvento,
  postEvento,
  patchEvento,
  deleteEvento,
} from '../controllers/evento.controller.js';

export const eventoRouter = Router();

eventoRouter.get('/', getEventos);
eventoRouter.get('/:id', getEvento);
eventoRouter.post('/', postEvento);
eventoRouter.patch('/:id', patchEvento);
eventoRouter.delete('/:id', deleteEvento);
