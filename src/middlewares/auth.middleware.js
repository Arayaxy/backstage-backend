import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

// TODO: La parte de autenticación va a venir de Firebase,
// hay que ver aplicar el middleware de autenticación acorde a ello.

// import { verifyToken } from '../../domains/auth/auth.service.js';

// export const authenticate = async (req, res, next) => {
//   try {
//     const bearer = req.headers.authorization;
//     const cookieToken = req.cookies?.token;
//     const headerToken = bearer?.startsWith('Bearer ') && bearer.split(' ')[1];
//     const token = cookieToken || headerToken;

//     if (!token)
//       return res.status(401).json({ message: 'Autenticación requerida' });

//     const payload = await verifyToken(token);
//     req.auth = payload; // { sub: userId, role: 'user', iat, exp }
//     next();
//   } catch {
//     res.status(401).json({ message: 'Token inválido o expirado' });
//   }
// };

// export const authorize = (...roles) => (req, res, next) => {
//   if (!roles.includes(req.auth.role))
//     return res.status(403).json({ message: 'Permisos insuficientes' });
//   next();
// };



export const validarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ ok: false, msg: 'Acceso denegado, token requerido' });
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = decoded;
    next();

  } catch (error) {
    return res.status(401).json({ ok: false, msg: 'Token invalido' });
  }
};
