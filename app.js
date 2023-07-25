'use strict'
const express = require('express')
const { engine } = require('express-handlebars')
const app = express()
const port = 3000
const db=require('./models')
const Restaurant=db.Restaurant
const bodyParser = require('body-parser')
const restaurant = require('./models/restaurant')
const methodOverride = require('method-override') 
app.engine('.hbs', engine({extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/',(req,res)=>{
  res.redirect('/restaurants')
})

app.get('/restaurants',(req,res)=>{
  return Restaurant.findAll({
    attributes:['id','image','name'],
    raw:true
  })
    .then((restaurants)=>res.render('index',{restaurants}))
})
app.get('/restaurants/create',(req,res)=>{
  res.render('create')
})

app.post('/restaurants',(req,res)=>{
  const newRestaurant= req.body
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

app.get('/restaurants/:id',(req,res)=>{
  const id=req.params.id
  return Restaurant.findByPk(id,({
    attributes:['id','name','name_en','category','image','location','phone','google_map','rating','description'],
    raw:true
  })).then((restaurant)=>res.render('detail',{restaurant}))
})

app.get('/restaurants/:id/edit',(req,res)=>{
  const id=req.params.id
  return Restaurant.findByPk(id,({
    attributes:['id','name','name_en','category','image','location','phone','google_map','rating','description'],
    raw:true
  })).then((restaurant)=>res.render('edit',{restaurant}))
})

app.put('/restaurants/:id',(req,res)=>{
  const body=req.body
  const id=req.params.id
  return Restaurant.update({
      name: body.name,
      name_en: body.name_en,
      category: body.category,
      image: body.image,
      location: body.location,
      phone: body.phone,
      google_map: body.google_map,
      rating: body.rating,
      description: body.description
  },{where:{id}}).then(()=>{res.redirect(`/restaurants/${id}`)})
})

app.delete('/restaurants/:id',(req,res)=>{
  const id=req.params.id
  return Restaurant.destroy({
    where:{id}
  }).then(()=>res.redirect('/restaurants'))
})
app.listen(port, () => {
  console.log(`Click : http://localhost:3000`)
})