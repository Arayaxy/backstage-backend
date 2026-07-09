// Recibe los roles que pueden acceder, por ejemplo: authorize('admin').
export const authorize = (...roles) => (req, res, next) => {
  // authenticate debe ejecutarse antes para crear req.user.
  if (!req.user) {
    return res.status(401).json({
      ok: false,
      message: 'Autenticación requerida',
    });
  }

  // Comprueba que el rol del usuario esté entre los roles permitidos.
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      ok: false,
      message: 'No tienes permisos para realizar esta acción',
    });
  }

  // El usuario tiene permiso y puede continuar hacia el controlador.
  return next();
};
