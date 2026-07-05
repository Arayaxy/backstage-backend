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
