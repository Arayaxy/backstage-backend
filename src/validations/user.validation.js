import { body } from 'express-validator';

export const nameValidationChain = (unique = true) => {
  const chain = body('name')
    .exists().withMessage('El nombre es obligatorio').bail()
    .isString().withMessage('El nombre debe ser un texto').bail().trim().escape()
    .notEmpty().withMessage('El nombre no puede estar vacío').bail()
    .isLength({ max: 20 }).withMessage('El nombre debe tener máximo 20 caracteres');
  if (unique)
    chain.custom(async value => {
      // if (consulta a la BD si existe el name)
      //   throw new Error('El nombre ya está en uso');
    });
  return chain;
};

export const emailValidationChain = (unique = true) => {
  const chain = body('email')
    .exists().withMessage('El correo electrónico es obligatorio').bail()
    .notEmpty().withMessage('El correo electrónico no puede estar vacío').bail()
    .isEmail().withMessage('El formato del correo electrónico no es válido').bail().normalizeEmail()
    .isLength({ max: 254 }).withMessage('El correo debe tener máximo 254 caracteres');
  if (unique)
    chain.custom(async value => {
      // if (consulta la BD si existe el email)
      //   throw new Error('El correo electrónico ya está en uso');
    });
  return chain;
}

export const passwordValidationChain = (strong = true) => {
  const chain = body('password')
    .exists().withMessage('La contraseña es obligatoria').bail()
    .notEmpty().withMessage('La contraseña no puede estar vacía').bail()
    .isString().withMessage('La contraseña debe ser un texto').bail()
    .isLength({ min: 8, max: 128 }).withMessage('La contraseña debe tener entre 8 y 128 caracteres');
  if (strong)
    chain.bail().isStrongPassword({
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    }).withMessage('La contraseña debe tener 1 mayúscula, 1 minúscula, 1 número y 1 símbolo');
  return chain;
}

export const roleValidationChain = () =>
  body('role')
    .optional()
    .isIn(['user', 'admin']).withMessage('Rol no válido');
