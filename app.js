const express = require('express')
const { engine } = require('express-handlebars')
const app = express()
const port = 3000
const db=require('./models')
const Restaurant=db.Restaurant
const bodyParser = require('body-parser')
app.engine('.hbs', engine({extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/',(req,res)=>{
  res.redirect('/restaurants')
})

app.get('/restaurants',(req,res)=>{
  return Restaurant.findAll({
    attribute:['id','image','name'],
    raw:true
  })
    .then((restaurants)=>res.render('index',{restaurants}))
})
app.get('/restaurants/create',(req,res)=>{
  res.render('create')
})

app.post('/restaurants',(req,res)=>{
  const newRestaurant= req.body
  console.log(newRestaurant)
  return Restaurant.create({
      name: newRestaurant.name,
      name_en: newRestaurant.name_en,
      category: newRestaurant.category,
      image: newRestaurant.image,
      location: newRestaurant.location,
      phone: newRestaurant.phone,
      google_map: newRestaurant.google_map,
      rating: newRestaurant.rating,
      description: newRestaurant.description
  }).then(()=>res.redirect('/restaurants'))
})

app.get('/restaurants/:id')


app.listen(port, () => {
  console.log(`Click : http://localhost:3000`)
})