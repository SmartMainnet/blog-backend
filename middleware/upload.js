import fs from 'fs'
import multer from 'multer'

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads')
    }
    cb(null, 'uploads')
  },
  filename: (_, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

const types = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif']

const fileFilter = (_, file, cb) => {
  if (types.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const limits = {
  fileSize: 1024 * 1024 * 5,
  files: 1,
}

export default multer({ storage, fileFilter, limits })
