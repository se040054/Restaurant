const express = require('express')
const { engine } = require('express-handlebars')
const app = express()
const port = 3000
const db=require('./models')
const Restaurant=db.Restaurant
app.engine('.hbs', engine({extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))

app.get('/',(req,res)=>{
  res.redirect('/restaurants')
})

app.get('/restaurants',(req,res)=>{
  return Restaurant.findAll()
    .then((Restaurants)=>res.send({Restaurants}))
})

app.listen(port, () => {
  console.log(`Click : http://localhost:3000`)
})