const express  =require('express')
const router =express.Router()
const db=require('../models')
const Restaurant=db.Restaurant
const { Op } = require('sequelize');

router.get('/',(req,res)=>{
  const keyword = req.query.search?.trim()
  console.log(keyword)
  
  if (keyword){
    return Restaurant.findAll({
      attributes:['id','image','name'],
      raw:true,
      where : {
        name : {
          [Op.like] : `%${keyword}%` }
      }
    }
    ).then((restaurants)=>{
      console.log(restaurants)
      if (restaurants.length===0){
        return res.render('empty',{keyword})
      }
      else{
        return res.render('index',{restaurants,keyword})
      }
    })
  }


  return Restaurant.findAll({
    attributes:['id','image','name'],
    raw:true
  })
    .then((restaurants)=>res.render('index',{restaurants,keyword}))
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