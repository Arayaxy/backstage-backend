// Se ejecuta cuando ninguna de las rutas anteriores coincide con la petición.
export const notFoundHandler = (req, res) => {
  return res.status(404).json({
    ok: false,
    message: `La ruta solicitada [${req.method} ${req.originalUrl}] no existe.`,
  });
};
