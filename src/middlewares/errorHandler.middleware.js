import { env } from '../config/env.js';

export const errorHandler = (err, req, res, _next) => {
  console.error(`\n 🚨 CRITICAL ERROR 🚨`);
  console.error(`- Time: ${new Date().toISOString()}`);
  console.error(`- Route: ${req.method} ${req.originalUrl}`);
  console.error(`- Message: ${err.message}`);

  if (env.mode === 'development')
    console.error(`- Stack Trace:\n${err.stack}`);

  console.error();

  res.status(err.status || 500).json({
    ok: false,
    message: env.mode === 'production' ? 'Error interno del servidor' : err.message
  });
};
