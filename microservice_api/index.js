import express from 'express'
import mongoose from 'mongoose'
import passport from 'passport'
import passportLocal from 'passport-local'
import User from './schemas/user'
import UserApi from './api/user'
import GenerateApi, {listenComplete} from './api/generate'
import jwt from 'jsonwebtoken'
import shared from './shared'
import cryptoConfig from './config/crypto'

const app = express()
const LocalStrategy = passportLocal.Strategy
const httpServer = require('http').Server(app);
const io = require('socket.io')(httpServer);
shared.io = io;

mongoose.connect('mongodb://localhost/rabbit_mq_example')

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*')

  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  )

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, authorization')

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true)

  // Pass to next layer of middleware
  next()
})

//passport.use(new LocalStrategy(User.authenticate()));
app.use((req, res, next) => {
  const token = req.headers['authorization'];


  if (token) {
    jwt.verify(token, cryptoConfig.jwtSecret, function (err, decoded) {
      if (err) {
        next()
      } else {
        req.userJWT = decoded
        return next();
      }
    });
  }
  next()
})

app.use('/', UserApi)
app.use('/', GenerateApi)
listenComplete()
console.log(listenComplete)

app.use(passport.initialize())
passport.use(User.createStrategy({ usernameField: 'email' }));


httpServer.listen(4000, () => console.log('Example app listening on port 4000!'))