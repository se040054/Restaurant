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

router.post('/register',(req,res,next)=>{
    const body = req.body;
    const {name , email ,password , confirm_password}  =body
    if (!email || !password  || !confirm_password){
      req.flash("error","資料未填寫")
      return res.redirect('back')
    }
    if (password!==confirm_password){
      req.flash("error", "密碼不一致");
      return res.redirect("back");
    }
    return User.findOne({where:{email}}).then((user)=>{
      if (user){
        req.flash('error','信箱已被使用')
        return res.redirect("back");
      }
      return User.create({
      name,
      email,
      password
    }).then(()=>{
      req.flash("success","創建成功")
      return res.redirect('/users/login')
    }).catch((error)=>{
      error.errorMessage="創建失敗"
      next(error)
    })
    })
})


module.exports = router;