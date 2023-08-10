'use strict'
const express = require('express')
const app = express()
const { engine } = require('express-handlebars')
const port = 3000
const bodyParser = require('body-parser')

const methodOverride = require('method-override')
const flash = require("connect-flash");
const session = require("express-session");
const messageHandler = require('./middleware/message-handler')
const errorHandler = require('./middleware/error-handler')

if (process.env.NODE_ENV === 'development') {
  require("dotenv").config();
}
const passport = require("passport"); //要放在變數後面
const router = require("./routers"); //要放在變數後面
app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(flash());


app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(messageHandler)

app.use(router)
app.use(errorHandler)

app.listen(port, () => {
  console.log('Click : http://localhost:3000')
})
