import { Router } from 'express';
import { getLogin, getLogout, verifySession } from '../controllers/auth.controller.js';

export const authRouter = Router();

authRouter.post('/login', getLogin);
authRouter.get('/verify', verifySession);
authRouter.post('/logout', getLogout);
