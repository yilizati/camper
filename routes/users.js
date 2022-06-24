const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')
const users = require('../controllers/users')

router.route('/register')
  .get(users.renderRegisterForm)
  .post(catchAsync(users.register))

router.route('/login')
  .get(users.renderLoginForm)
  .post(passport.authenticate(
    'local',
    {
      failureRedirect: '/login',
      failureFlash: true
    }
  ),
    users.login)

router.get('/logout', users.logout)

module.exports = router
