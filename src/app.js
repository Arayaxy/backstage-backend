import { env } from './config/env.js';
import express from 'express';
import cors from 'cors';
import { notFoundHandler, errorHandler } from './middlewares/index.js';
import { initializeApp, cert } from 'firebase-admin/app';
import cookieParser from 'cookie-parser';
import { healthRouter, authRouter, clienteRouter, espacioRouter, eventoRouter, ponenteRouter } from './routes/index.js';
import { serviceAccount } from './config/firebaseServiceAccount.js';

if (env.mode === 'production')
  console.log(`\n⚡RUNNING IN PRODUCTION MODE ⚡`);
else if (env.mode === 'development')
  console.log(`\n🚧 RUNNING IN DEVELOPMENT MODE 🚧`);

initializeApp({
  credential: cert(serviceAccount)
});

const app = express();

app.use(cors({
  'origin': env.corsOrigins,
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false,
  'optionsSuccessStatus': 200,
  'credentials': true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Error forzado al acceder a la ruta /debug/force-error
   para propósitos de desarrollo, no existe en producción */
if (env.mode === 'development')
  app.get(`${env.apiUrl}/debug/force-error`, () => {
    throw new Error('«¡Trata de arrancarlo, Carlos! ¡Trata de arrancarlo, por Dios, Carlos!»');
  });

app.use(`${env.apiUrl}/health`, healthRouter);
app.use(`${env.apiUrl}/auth`, authRouter);
app.use(`${env.apiUrl}/eventos`, eventoRouter);
app.use(`${env.apiUrl}/clientes`, clienteRouter);
app.use(`${env.apiUrl}/espacios`, espacioRouter);
app.use(`${env.apiUrl}/ponentes`, ponenteRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`🚀 Server listening on port: ${env.port}`);
});
