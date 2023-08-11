const express = require("express");
const router = express.Router();
const db = require("../models");
const User=db.User
const bcrypt=require('bcryptjs')
//頁面不抓取id(user只有一個)所以沒有設置驗證是否同userId
//沒有套用路由前綴
router.get("/profile", (req, res) => {
  let {name,email,role}=req.user
  const user=req.user
  if (role==="web_user"){
    role = 'Web account'
  }else if (role==="google_user"){
    role = 'Google account'
  }
  if (name===null){
    name = "Unnamed"
  }

  res.render("profile", { name,email,role,user});

});

router.get("/profile/edit", (req, res) => {
  const { name, email ,role} = req.user;
  const user = req.user;
  res.render("profile_edit", { name, email,role,user });
});

router.put("/profile/edit",async (req,res,next)=>{
  const userId=req.user.id
  const {name,email,password,confirm_password} = req.body
  console.log(password)
  const profile =  await User.findByPk(userId) //要讓sql返回一個實例而不是物件 不能使用第二參數
    .catch((error)=>{
      error.errorMessage = "伺服器錯誤"
      next(error)
    })
  if (userId!==profile.id){
    req.flash('error','權限不足')
    return res.redirect('/profile_edit')
  }
  if (confirm_password!==password){
    req.flash("error", "密碼不一致");
    return res.redirect("/profile_edit");
  }

  if (name && name!==profile.name){
    profile.name = name 
  }
  if (email && email!==profile.email){
    profile.email = email 
  }
  if (password){
    const hash = await bcrypt.hash(password,10)
    profile.password = hash
  }

  await profile.save()
  req.flash('success','修改資料成功')
  return res.redirect("/profile");
})





module.exports=router;