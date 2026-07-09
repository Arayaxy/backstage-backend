import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const authenticate = (req, res, next) => {
  // Recupera el token JWT guardado en la cookie durante el login.
  const token = req.cookies?.token;

  // Sin token no podemos saber quién está realizando la petición.
  if (!token) {
    return res.status(401).json({
      ok: false,
      message: 'Autenticación requerida',
    });
  }

  try {
    // Verifica el token y guarda sus datos para los siguientes middlewares.
    req.user = jwt.verify(token, env.jwtSecret);
    return next();
  } catch {
    // También entra aquí cuando el token está manipulado o ha caducado.
    return res.status(401).json({
      ok: false,
      message: 'Sesión inválida o expirada',
    });
  }
};
