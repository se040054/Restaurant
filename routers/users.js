const express = require("express");
const router = express.Router();
const db = require("../models");
const User = db.User;
const passport = require("passport");
const bcrypt=require('bcryptjs')

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {
  //這邊與教案不同，先進行router抓取資料有沒有空值
  const { email, password } = req.body;
  if (!email || !password) {
    req.flash("error", "密碼或信箱不能為空");
    return res.redirect("back");
  }
  passport.authenticate("local", {
    successRedirect: "/restaurants",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res, next) => {
  const body = req.body;
  const { name, email, password, confirm_password } = body;
  if (!email || !password || !confirm_password) {
    req.flash("error", "資料未填寫");
    return res.redirect("back");
  }
  if (password !== confirm_password) {
    req.flash("error", "密碼不一致");
    return res.redirect("back");
  }
  return User.findOne({ where: { email } }).then((user) => {
    if (user) {
      req.flash("error", "信箱已被使用");
      return res.redirect("back");
    }
    return bcrypt.hash(password, 10).then((hash) => {
      return User.create({
        name,
        email,
        password: hash,
        role:'web_user'
      })
        .then(() => {
          req.flash("success", "創建成功");
          return res.redirect("/users/login");
        })
        .catch((error) => {
          error.errorMessage = "創建失敗";
          next(error);
        });
    });
  });
});

router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/users/login");
  });
});


router.get("/login/google",passport.authenticate("google"));


router.get("/oauth2/google/callback",
  passport.authenticate("google", {
    successReturnToOrRedirect: "/restaurants",
    failureRedirect: "/users/login",
    failureFlash: true,
  })
);

router.get('/login/facebook',passport.authenticate('facebook',{ scope: ['email'] }
))

router.get('/oauth2/redirect/facebook', passport.authenticate('facebook', {
  successRedirect: '/restaurants',
  failureRedirect: '/users/login',
  failureFlash: true
}))



module.exports = router;
