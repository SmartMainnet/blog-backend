import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import UserModel from '../models/User.js'

// Регистрация
export const register = async (req, res) => {
  try {
    const { email, password, fullName, avatarUrl } = req.body
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const doc = new UserModel({
      email,
      passwordHash: hash,
      fullName,
      avatarUrl,
    })

    const user = await doc.save()
    const { passwordHash, ...userData } = user._doc

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.json({
      ...userData,
      token,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Не удалось зарегистрироваться',
    })
  }
}

// Авторизация
export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email })

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      })
    }

    const { passwordHash, ...userData } = user._doc

    const isMatch = await bcrypt.compare(req.body.password, passwordHash)

    if (!isMatch) {
      return res.status(401).json({
        message: 'Неверный логин или пароль',
      })
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.json({ ...userData, token })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Не удалось авторизоваться',
    })
  }
}

// Авторизация по jwt
export const authMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId).select('-passwordHash')
    res.json(user)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Не удалось авторизоваться',
    })
  }
}
