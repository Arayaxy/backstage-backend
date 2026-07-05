import { body } from 'express-validator';
import { RequestContext } from '@mikro-orm/core';
import { User } from '../../domains/users/user.entity.js';
import { Section } from '../../domains/sections/section.entity.js';

export const nameValidationChain = (unique = true) => {
  const chain = body('name')
    .exists().withMessage('El nombre es obligatorio').bail()
    .isString().withMessage('El nombre debe ser un texto').bail().trim().escape()
    .notEmpty().withMessage('El nombre no puede estar vacío').bail()
    // TODO: define max name chars in a variable to be reused by the entity to match database type.
    .isLength({ max: 20 }).withMessage('El nombre debe tener máximo 20 caracteres');
  if (unique)
    chain.custom(async value => {
      if (await RequestContext.getEntityManager().findOne(User, { name: value }))
        throw new Error('El nombre ya está en uso');
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
      if (await RequestContext.getEntityManager().findOne(User, { email: value }))
        throw new Error('El correo electrónico ya está en uso');
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
    .isIn(['user', 'collaborator', 'moderator', 'admin']).withMessage('Rol no válido');


export const sectionNameValidationChain = (unique = true) => {
  const chain = body('name')
    .exists().withMessage('El nombre de la sección es obligatorio').bail()
    .isString().withMessage('El nombre de la sección debe ser un texto').bail().trim().escape()
    .notEmpty().withMessage('El nombre de la sección no puede estar vacío').bail()
    .isLength({ max: 20 }).withMessage('El nombre de la sección debe tener máximo 20 caracteres');
  if (unique)
    chain.custom(async value => {
      if (await RequestContext.getEntityManager().findOne(Section, { name: value }))
        throw new Error('Ya existe una sección con ese nombre');
    });
  return chain;
}

export const sectionDescriptionValidationChain = () =>
  body('description')
    .exists().withMessage('La descripción de la sección es obligatoria').bail()
    .isString().withMessage('La descripción de la sección debe ser un texto').bail().trim().escape()
    .notEmpty().withMessage('La descripción de la sección no puede estar vacía').bail()
    .isLength({ max: 100 }).withMessage('La descripción de la sección debe tener máximo 100 caracteres');


export const boardNameValidationChain = () => {
  const chain = body('name')
    .exists().withMessage('El nombre del foro es obligatorio').bail()
    .isString().withMessage('El nombre del foro debe ser un texto').bail().trim().escape()
    .notEmpty().withMessage('El nombre del foro no puede estar vacío').bail()
    .isLength({ max: 20 }).withMessage('El nombre del foro debe tener máximo 20 caracteres');
  return chain;
}

export const boardDescriptionValidationChain = () =>
  body('description')
    .exists().withMessage('La descripción del foro es obligatoria').bail()
    .isString().withMessage('La descripción del foro debe ser un texto').bail().trim().escape()
    .notEmpty().withMessage('La descripción del foro no puede estar vacía').bail()
    .isLength({ max: 100 }).withMessage('La descripción del foro debe tener máximo 100 caracteres');


export const topicTitleValidationChain = () =>
  body('title')
    .exists().withMessage('El título del tema es obligatorio').bail()
    .isString().withMessage('El título del tema debe ser un texto').bail().trim().escape()
    .notEmpty().withMessage('El título del tema no puede estar vacío').bail()
    .isLength({ max: 80 }).withMessage('El título del tema debe tener máximo 80 caracteres');


export const postContentValidationChain = () =>
  body('content')
    .exists().withMessage('El contenido es obligatorio').bail()
    .isString().withMessage('El contenido debe ser un texto').bail().trim().escape()
    .notEmpty().withMessage('El contenido no puede estar vacío');
