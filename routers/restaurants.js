const express  =require('express')
const router =express.Router()
const db=require('../models')
const Restaurant=db.Restaurant
const { Op, or } = require('sequelize');

router.get('/',async (req,res)=>{
  const keyword = req.query.search?.trim()
  console.log(keyword)
  let restaurants;
  const sort=req.query.sort
  let column;
  let order;
  switch(sort){
    case "AtoZ" : [column,order]=["name","asc"] ;break
    case "ZtoA" : [column,order]=["name","desc"] ;break
    case "類別" : [column,order]=["category","asc"] ;break
    case "地區" : [column,order]=["location","desc"] ;break
  }
  console.log(sort)
  if (keyword){
           restaurants = await Restaurant.findAll({
          attributes:['id','image','name'],
          raw:true,
          where : {
          name : {[Op.like] : `%${keyword}%` }               
          },
          order : [[ column||"name" , order||"ASC" ]]
        })}
      else {
       restaurants = await Restaurant.findAll({
      attributes:['id','image','name'],
      raw:true ,
      order : [[ column||"name" , order||"ASC" ]]
      })
      }
  
  

  if (restaurants.length===0){
    res.render(('empty'),{keyword})
  }else {
    res.render('index',{keyword,restaurants,sort})
  }
  
})


router.get('/create',(req,res)=>{
  res.render('create')
})

router.post('/',(req,res)=>{
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
  }).then(()=>res.redirect('/'))
})

router.get('/:id',(req,res)=>{
  const id=req.params.id
  return Restaurant.findByPk(id,({
    attributes:['id','name','name_en','category','image','location','phone','google_map','rating','description'],
    raw:true
  })).then((restaurant)=>res.render('detail',{restaurant}))
})

router.get('/:id/edit',(req,res)=>{
  const id=req.params.id
  return Restaurant.findByPk(id,({
    attributes:['id','name','name_en','category','image','location','phone','google_map','rating','description'],
    raw:true
  })).then((restaurant)=>res.render('edit',{restaurant}))
})

router.put('/:id',(req,res)=>{
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
  },{where:{id}}).then(()=>{res.redirect(`${id}`)})
})

router.delete('/:id',(req,res)=>{
  const id=req.params.id
  return Restaurant.destroy({
    where:{id}
  }).then(()=>res.redirect('/'))
})


module.exports = router