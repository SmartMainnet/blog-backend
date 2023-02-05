import { body } from 'express-validator'

export const registerValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум 6 символов').isLength({ min: 6 }),
  body('fullName', 'Имя должно быть минимум 3 символа').isLength({ min: 3 }),
  body('avatarUrl', 'Неверная ссылка на аватарку').optional().isString()
]

export const loginValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум 6 символов').isLength({ min: 6 })
]

export const postCreateValidation = [
  body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
  body('text', 'Введите текст статьи').isLength({ min: 3 }).isString(),
  body('tags', 'Неверный формат тэгов').optional().isArray(),
  body('imageUrl', 'Неверная ссылка на изображение').optional().isString()
]