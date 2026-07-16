import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { getAuth } from 'firebase-admin/auth';
import prisma from '../lib/prismaAdmin.js';

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
      const { uid: userId, name, email: rawEmail } = decodedFirebaseToken;
      const email = rawEmail?.toLowerCase().trim();

      console.log('getLogin: checking email:', email);
      const usuario = await prisma.usuario.findFirst({ where: { email } });
      console.log('getLogin: found usuario:', usuario);



      if (!usuario) {
        return res.status(403).json({
          ok: false,
          message: 'No tienes privilegios de acceso'
        });
      }

      // userPayload = { userId, name, email, role: 'admin' };
      userPayload = { userId, name, email, role: usuario.rol };
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
    console.error('FIREBASE ERROR:', error?.code, error?.message);

    return res.status(401).json({
      ok: false,
      message: 'El token no es valido o ha expirado'
    });
  }
};

export const backdoorRegister = async (req, res) => {
  try {
    const { fullName, email: rawEmail, admin_super_key } = req.body;
    const email = rawEmail?.toLowerCase().trim();

    if (admin_super_key !== env.adminSuperKey) {
      return res.status(403).json({
        ok: false,
        message: 'Clave de administrador inválida'
      });
    }

    const existing = await prisma.usuario.findFirst({ where: { email } });

    if (existing) {
      await prisma.usuario.update({
        where: { id: existing.id },
        data: { nombreUsuario: fullName, rol: 'admin' }
      });
    } else {
      await prisma.usuario.create({
        data: { nombreUsuario: fullName, email, rol: 'admin' }
      });
    }

    return res.status(201).json({
      ok: true,
      message: 'Usuario administrador registrado correctamente'
    });

  } catch (error) {
    console.error('Backdoor Error:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al registrar el administrador'
    });
  }
};

export const getAdmins = async (req, res) => {
  try {
    const admins = await prisma.usuario.findMany({
      where: { rol: 'admin' },
      select: { id: true, nombreUsuario: true, email: true, rol: true }
    });

    return res.json({ ok: true, data: admins });

  } catch (error) {
    console.error('getAdmins Error:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener la lista de administradores'
    });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const { email } = req.params;
    const { fullName } = req.body;

    const usuario = await prisma.usuario.findFirst({ where: { email } });

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        message: 'Administrador no encontrado'
      });
    }

    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { nombreUsuario: fullName }
    });

    return res.json({
      ok: true,
      message: 'Administrador actualizado correctamente'
    });

  } catch (error) {
    console.error('updateAdmin Error:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al actualizar el administrador'
    });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const { email } = req.params;
    const normalizedEmail = email.toLowerCase().trim();

    console.log('DeleteAdmin: searching for email:', normalizedEmail);

    const usuario = await prisma.usuario.findFirst({ where: { email: normalizedEmail } });

    console.log('DeleteAdmin: found user:', usuario);

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        message: 'Administrador no encontrado'
      });
    }

    await prisma.usuario.delete({ where: { id: usuario.id } });

    return res.json({
      ok: true,
      message: 'Administrador eliminado correctamente'
    });

  } catch (error) {
    console.error('deleteAdmin Error:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al eliminar el administrador'
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

    const usuario = await prisma.usuario.findFirst({
      where: { email: decoded.email }
    });

    if (!usuario) {
      res.clearCookie('token');
      res.clearCookie('is_logged_in');
      return res.status(401).json({ ok: false, message: 'Usuario no encontrado' });
    }

    return res.json({
      ok: true,
      user: {
        userId: decoded.userId,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
      }
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
