import mongoose from 'mongoose'
import passport from 'passport'
import User from '../schemas/user'
import bodyParser from 'body-parser'
import express from 'express'
import jwt from 'jsonwebtoken'
import cryptoConfig from '../config/crypto'

const router = express.Router()

router.post('/register', bodyParser.json({limit: '5mb'}), (req, res) => {

  User.register(
    new User({email: req.body.email}),
    req.body.password,
    (err) => {
      console.log(err)
      if (err) {
        res.status(402).json({
          error: true,
          name: err.name
        })
        return
      }
      passport.authenticate('local', {
        session: false
      })(req, res, () => {
        //generate JWT
        const token = jwt.sign(
          {
            user: req.user.email
          },
          cryptoConfig.jwtSecret,
          {
            expiresIn: 20 * 60 * 60
          }
        )
        res.status(201).json({
          token,
          email: req.user.email
        })
      })
    }
  )
})

router.post('/login', bodyParser.json({limit: '5mb'}), (req, res) => {
  passport.authenticate('local', {
    session: false
  })(req, res, function(err) {

    //generate JWT
    const token = jwt.sign(
      {
        user: req.user.email
      },
      'secret',
      {
        expiresIn: 20 * 60 * 60
      }
    )
    res.status(201).json({
      token: token,
      email: req.user.email
    })
  })
})

router.post('/logout', bodyParser.json({limit: '5mb'}), (req, res) => {
  res.status(201).end()
})

router.post('/me', bodyParser.json({limit: '5mb'}), (req, res) => {
  res.json(res.user)
})

export default router