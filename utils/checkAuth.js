import jwt from 'jsonwebtoken'

export default (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded._id
    next()
  } catch (error) {
    res.status(403).json({ message: 'Нет доступа' })
  }
}