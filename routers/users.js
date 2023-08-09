const express = require("express");
const router = express.Router();
const db = require("../models");
const User=db.User
router.get('/login',(req,res)=>{
  res.render('login')
})

router.post('/login',(req,res)=>{
  const body = req.body
  console.log(body)
  res.send('login')
})

router.get('/register',(req,res)=>{
  res.render('register')
})

router.post('/register',(req,res)=>{
    const body = req.body;
    const {name , email ,password , confirm_password}  =body
    if (!email || !password  || !confirm_password){
      console.log("資料未填寫")
      return res.redirect('back')
    }
    if (password!==confirm_password){
      console.log("密碼不一致");
      return res.redirect("back");
    }
    return User.create({
      name,
      email,
      password
    }).then(()=>{
      res.redirect('/users/login')
    })

})


module.exports = router;