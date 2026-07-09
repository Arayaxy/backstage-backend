// Centraliza las exportaciones para importar los middlewares desde un solo archivo.
export { authenticate } from './authenticate.middleware.js';
export { authorize } from './authorize.middleware.js';
export { errorHandler } from './errorHandler.middleware.js';
export { notFoundHandler } from './notFound.middleware.js';
export { validateInputs } from './validateInputs.middleware.js';
