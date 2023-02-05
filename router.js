import Router from 'express'
import uploads from './middleware/upload.js'
import { registerValidation, loginValidation, postCreateValidation } from './validations.js'
import { checkAuth, handleValidationErrors } from './utils/index.js'
import { UserControlle, PostController } from './controllers/index.js'

const router = new Router()

// Регистрация
router.post('/auth/register', registerValidation, handleValidationErrors, UserControlle.register)
// Авторизация
router.post('/auth/login', loginValidation, handleValidationErrors, UserControlle.login)
// Авторизация по jwt
router.get('/auth/me', checkAuth, UserControlle.authMe)

// Создание статьи
router.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
// Обновление статьи
router.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update)
// Удаление статьи
router.delete('/posts/:id', checkAuth, PostController.remove)
// Получение списка статей
router.get('/posts', PostController.getAll)
// Получение статьи по id
router.get('/posts/:id', PostController.getOne)
// Получение последних тегов статей
router.get('/tags', PostController.getLastTags)
// Загрузка изображения
router.post('/uploads', uploads.single('image'), PostController.upload)

export default router
