const { Router } = require('express')
const router = Router()
const User = require('../models/User')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const alertErr = require('alert');

router.post('/registration',
  [
    check('login', 'Некорректный логин').isEmail(),
    check('password', 'Некорректный пароль').isLength({ min: 6 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        alertErr("Некорректные данные при регистрации")
        return res.status(400).send({
          errors: errors.array(),
          message: 'Некорректные данные при регистрации',
        })
      }
      const { login, password, rep_password } = req.body
      if (rep_password != password) {
        alertErr("Пароли не совпадают.")
        return res.status(300).send({ message: 'Пароли не совпадают.' })
      }
      const isUsed = await User.findOne({ login })
      if (isUsed) {
        alertErr("Данный Логин уже занят, попробуйте другой.")
        return res.status(300).send({ message: 'Данный Логин уже занят, попробуйте другой.' })
      }
      const hashedPassword = await bcrypt.hash(password, 12)
      const user = new User({
        login,
        password: hashedPassword,
        rep_password
      })
      await user.save()
      res.status(201).send({ message: 'Пользователь создан' })
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
        alertErr("Некорректные данные")
        return res.status(400).send({
          errors: errors.array(),
          message: 'Некорректные данные'
        })
      }

      const { login, password } = req.body

      const user = await User.findOne({ login })

      if (!user) {
        alertErr("Такого Email нет в базе")
        return res.status(400).send({ message: 'Такого Email нет в базе' })
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        alertErr("Неверный пароль")
        return res.status(400).send({ message: 'Неверный пароль' })
      }

      const jwtSecret = 'bterdwgjasklfjahwejgkvjbhsgvdf23t3423'

      const token = jwt.sign(
        { userId: user.id },
        jwtSecret,
        { expiresIn: '1h' }
      )

      res.send({ token, userId: user.id })

    } catch (error) {
      console.log("Ошибка")
      alertErr("Ошибка")
    }
  })

module.exports = router