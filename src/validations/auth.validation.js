import { checkSchema } from 'express-validator';

// Valida la cabecera que contiene el token enviado por Firebase.
export const loginValidation = checkSchema({
  authorization: {
    // Impide continuar cuando no se ha enviado ningún token.
    notEmpty: {
      errorMessage: 'El token de Firebase es obligatorio',
    },
    // Comprueba que la cabecera tenga el formato: Bearer token.
    matches: {
      options: [/^Bearer\s+\S+$/],
      errorMessage: 'La cabecera Authorization debe usar el formato Bearer',
    },
  },
// Indica que el campo authorization se busca en las cabeceras.
}, ['headers']);
