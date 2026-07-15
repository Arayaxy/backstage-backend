import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { getAuth } from 'firebase-admin/auth';

export const getLogin = async (req, res) => {

  const authHeader = req.headers.authorization;
  const firebaseToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!firebaseToken) {
    return res.status(400).json({ ok: false, message: 'No Token Encontrado' });
  }


  try {
    let userPayload;
    // DEVELOPMENT MOCK MODE
    if (env.mode === 'development' && firebaseToken === 'admin-test-token') {
      userPayload = {
        userId: "testId",
        name: "Tester Admin",
        email: "tester@admin.com",
        role: 'admin'
      };
    } else {
      //PRODUCTION MODE
      const decodedFirebaseToken = await getAuth().verifyIdToken(firebaseToken);
      const { uid: userId, name, email } = decodedFirebaseToken;

      userPayload = { userId, name, email, role: 'admin' };
    }

    const token = jwt.sign(userPayload, env.jwtSecret, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: env.mode === 'production',
      sameSite: env.mode === 'production' ? 'none' : 'lax',
      partitioned: env.mode === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({
      ok: true,
      user: userPayload
    });

  } catch (error) {
    console.error('Login Error Context:', error);

    return res.status(401).json({
      ok: false,
      message: 'El token no es valido o ha expirado'
    });
  }
};

export const verifySession = async (req, res) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ ok: false, message: 'No esta logeado' });
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);

    return res.json({
      ok: true,
      user: decoded
    });

  } catch (error) {
    return res.status(401).json({ ok: false, message: 'Session Invalida o Expirada' });
  }
};


export const getLogout = async (req, res) => {
  res.clearCookie('token');

  return res.json({
    ok: true,
    message: 'Session Cerrada!'
  });
};
