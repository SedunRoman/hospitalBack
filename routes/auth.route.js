const { Router } = require('express')
const router = Router()
const User = require('../models/User')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwtToken = require('jsonwebtoken')

router.post('/registration',
  [
    check('login', 'Некорректный логин').isEmail(),
    check('password', 'Некорректный пароль').isLength({ min: 6 })
  ],
  async (req, res) => {
    try {

      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректные данные при регистрации'
        })
      }

      const { login, password } = req.body

      const isUsed = await User.findOne({ login })

      if (isUsed) {
        return res.status(300).json({ message: 'Данный Логин уже занят, попробуйте другой.' })
      }

      const hashedPassword = await bcrypt.hash(password, 12)

      const user = new User({
        login,
        password: hashedPassword
      })

      await user.save()

      res.status(201).json({ message: 'Пользователь создан' })

    } catch (error) {
      console.log("Ошибка")
    }
  })

router.post('/login',
  [
    check('login', 'Некорректный логин').isEmail(),
    check('password', 'Некорректный пароль').exists()
  ],
  async (req, res) => {
    try {

      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректные данные при регистрации'
        })
      }

      const { login, password } = req.body

      const user = await User.findOne({ login })

      if (!user) {
        return res.status(400).json({ message: 'Такого Email нет в базе' })
      }

      const isMatch = bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res.status(400).json({ message: 'Пароли не совпадают' })
      }

      const jwtSecret = 'bterdwgjasklfjahwejgkvjbhsgvdf23t3423'

      const token = jwtToken.sign(
        { userId: user.id },
        jwtSecret,
        { expiresIn: '1h' }
      )

      res.json({ token, userId: user.id })

    } catch (error) {
      console.log("Ошибка")
    }
  })

module.exports = router