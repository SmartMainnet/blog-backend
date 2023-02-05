import PostModel from '../models/Post.js'

// Создание статьи
export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      user: req.userId,
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
    })

    const post = await doc.save()

    res.status(201).json(post)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Не удалось создать статью',
    })
  }
}

// Обновление статьи
export const update = async (req, res) => {
  try {
    const postId = req.params.id
    PostModel.updateOne(
      {
        _id: postId,
      },
      {
        user: req.userId,
        title: req.body.title,
        text: req.body.text,
        tags: req.body.tags,
        imageUrl: req.body.imageUrl,
      },
      (err, doc) => {
        if (err) {
          return res.status(404).json({
            message: 'Статья не найдена',
          })
        } else if (doc.modifiedCount === 0) {
          return res.status(404).json({
            message: 'Статья не найдена',
          })
        } else {
          res.status(200).json({
            message: 'Статья обновлена',
          })
        }
      }
    )
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Не удалось удалить статью',
    })
  }
}

// Удаление статьи
export const remove = async (req, res) => {
  try {
    const postId = req.params.id
    PostModel.findOneAndDelete({ _id: postId }, (err, doc) => {
      if (err) {
        console.log(err)
        return res.status(500).json({
          message: 'Не удалось удалить статью',
        })
      } else if (!doc) {
        return res.status(404).json({
          message: 'Статья не найдена',
        })
      } else {
        res.status(200).json({
          message: 'Статья удалена',
        })
      }
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Не удалось удалить статью',
    })
  }
}

// Получение списка статей
export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().sort({ createdAt: -1 }).populate('user', 'fullName avatarUrl')
    res.status(200).json(posts)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Не удалось получить статьи',
    })
  }
}

// Получение статьи по id
export const getOne = async (req, res) => {
  try {
    const postId = req.params.id
    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: 'after',
      }
    )
      .populate('user', 'fullName avatarUrl')
      .then(doc => {
        if (!doc) {
          return res.status(404).json({
            message: 'Статья не найдена',
          })
        } else {
          res.status(200).json(doc)
        }
      })
      .catch(err => {
        return res.status(404).json({
          message: 'Статья не найдена',
        })
      })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Не удалось получить статью',
    })
  }
}

// Получение последних тегов статей
export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().sort({ createdAt: -1 }).limit(5)

    const tags = [...new Set(posts.map(post => post.tags).flat())].slice(0, 5)

    res.status(200).json(tags)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Не удалось получить теги',
    })
  }
}

// Загрузка изображения
export const upload = async (req, res) => {
  try {
    res.json({
      url: `/uploads/${req.file.filename}`,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Не удалось загрузить изображение',
    })
  }
}
