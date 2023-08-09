'use strict'
const express = require('express')
const router = express.Router()
const restaurants = require('./restaurants')
const users=require('./users')
const authHandler = require('../middleware/auth-handler')

router.use("/restaurants", authHandler , restaurants);
router.use('/users', users)


router.get('/', (req, res) => {
  res.redirect('/restaurants')
})

module.exports = router
