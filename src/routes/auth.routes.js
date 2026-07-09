import { Router } from 'express';
import { getLogin, getLogout, verifySession } from '../controllers/auth.controller.js';
import { authenticate, validateInputs } from '../middlewares/index.js';
import { loginValidation } from '../validations/auth.validation.js';

export const authRouter = Router();

authRouter.post('/login', loginValidation, validateInputs, getLogin);
authRouter.get('/verify', authenticate, verifySession);
authRouter.post('/logout', getLogout);
