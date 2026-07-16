import { Router } from 'express';

import { authenticate, authorize, validateInputs } from '../middlewares/index.js';

import { getSolicitudesEdicion, getSolicitudEdicion, postSolicitudEdicion, patchSolicitudEdicion, deleteSolicitudEdicion } from '../controllers/solicitudEdicion.controller.js';

export const solicitudEdicionRouter = Router();

// solicitudEdicionRouter.use(authenticate, authorize('admin'));

solicitudEdicionRouter.get('/', getSolicitudesEdicion);
solicitudEdicionRouter.get('/:id', getSolicitudEdicion);
solicitudEdicionRouter.post('/', postSolicitudEdicion);
solicitudEdicionRouter.patch('/:id', patchSolicitudEdicion);
solicitudEdicionRouter.delete('/:id', deleteSolicitudEdicion);
