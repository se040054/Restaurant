'use strict'
const express = require('express')
const { engine } = require('express-handlebars')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const router = require('./routers')
const methodOverride = require('method-override')
const flash = require("connect-flash");
const session = require("express-session");
const messageHandler = require('./middleware/message-handler')
const errorHandler = require('./middleware/error-handler')
require("dotenv").config();
if (process.env.NODE_ENV === 'development') {
  app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
      }));
}
app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))


app.use(flash());
app.use(messageHandler)

app.use(router)
app.use(errorHandler)

app.listen(port, () => {
  console.log('Click : http://localhost:3000')
})
