const express = require("express");
const router = express.Router();
const db = require("../models");
const User = db.User;
const passport = require("passport");
const LocalStrategy = require("passport-local");
const { where } = require("sequelize");
const bcrypt = require("bcryptjs");
const GoogleStrategy = require("passport-google-oauth20");
const { raw } = require("mysql2");
passport.use( 
  new LocalStrategy({ usernameField: "email" }, (username, password, done) => {
    return User.findOne({
      attributes: ["id", "name", "email", "password"],
      where: { email: username },
      raw: true,
    })
      .then((user) => {
        if (!user) {
          return done(null, false, { message: "查無帳號" }); 
        }//登入策略時 不要用redirect導向 而是用done ，也不要寫flash(抓不到)
        return bcrypt.compare(password, user.password).then((isMatch) => {
          if (!isMatch) {
            return done(null,false,{message:"密碼錯誤"}) 
          }
          return done(null, user);
        });
      })
      .catch((error) => {
        error.errorMessage = "伺服器發生問題 請稍後再登入";
        done(error);
      });
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ["profile" , "email"], //要請求的資料
      state: true,
    },
     (accessToken, refreshToken, profile, done)=> {
      const {displayName} = profile
      const email = profile.emails[0].value
      console.log(profile)
      return User.findOne({
        attributes:['id' , 'email' , 'name' ],
        where : {email},
        raw:true
      }).then(async(user)=>{
        if (!user){
          const randomPwd = Math.random().toString(36).slice(-8);
          const hash = await bcrypt.hash(randomPwd,10)
          newUser = await User.create({ name:displayName, email, password:hash });
          return  done(null,{id: newUser.id,name: newUser.name,email: newUser.email,})
        }
       return await done(null,user)
      }).catch((error)=>{
        error.errorMessage="使用GOOGLE登入失敗"
        done(error)
      })
    }
  )
);
  
passport.serializeUser((user, done) => {
  const { id, name, email } = user;
  return done(null, { id, name, email });
});

passport.deserializeUser((user, done) => {
  return done(null, { id: user.id ,name:user.name,email:user.email });
});

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


router.get("/login/google", 
    passport.authenticate("google")
);


router.get("/oauth2/google/callback",
  passport.authenticate("google", {
    successReturnToOrRedirect: "/restaurants",
    failureRedirect: "/users/login",
    failureFlash: true,
  })
);




module.exports = router;
