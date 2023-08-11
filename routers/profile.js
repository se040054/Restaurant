const express = require("express");
const router = express.Router();
const db = require("../models");
const User=db.user

//頁面不抓取id(user只有一個)所以沒有設置驗證是否同userId

router.get("/profile", (req, res) => {
  let {name,email,role}=req.user
  console.log(req.user)
  console.log(name,email,role)
  if (role==="web_user"){
    role = 'Web account'
  }else if (role==="google_user"){
    rule = 'Google account'
  }
  res.render("profile", { name,email,role });

});

router.get("/profile/edit", (req, res) => {
  const { name, email ,role} = req.user;

  res.render("profile_edit", { name, email,role });
});

module.exports=router;