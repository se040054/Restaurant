'use strict'
const express = require('express')
const { engine } = require('express-handlebars')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const methodOverride = require('method-override') 


const router =require('./routers')
app.engine('.hbs', engine({extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));


app.use(router);



app.listen(port, () => {
  console.log(`Click : http://localhost:3000`)
})


