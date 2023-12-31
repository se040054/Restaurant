const passport = require("passport");
const LocalStrategy = require("passport-local");
const { where } = require("sequelize");
const bcrypt = require("bcryptjs");
const GoogleStrategy = require("passport-google-oauth20");
const FacebookStrategy = require('passport-facebook')
const { raw } = require("mysql2");
const db = require("../models");
const User = db.User;

passport.use(
  new LocalStrategy({ usernameField: "email" }, (username, password, done) => {
    return User.findOne({
      attributes: ["id", "name", "email", "password", "role"], //要存入session的user屬性
      where: { email: username },
      raw: true,
    })
      .then((user) => {
        if (!user) {
          return done(null, false, { message: "查無帳號" });
        } //登入策略時 不要用redirect導向 而是用done ，也不要寫flash(抓不到)
        return bcrypt.compare(password, user.password).then((isMatch) => {
          if (!isMatch) {
            return done(null, false, { message: "密碼錯誤" });
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
      scope: ["profile", "email"], //要請求的資料
      state: true, //防止偽造攻擊，比對請求身分
    },
    (accessToken, refreshToken, profile, done) => {
      const { displayName } = profile;
      const email = profile.emails[0].value;
      //  console.log(profile);
      return User.findOne({
        attributes: ["id", "email", "name", "role"],
        where: { email },
        raw: true,
      })
        .then(async (user) => { //找不到就註冊後登入，找的到就登入
          if (!user) {
            const randomPwd = Math.random().toString(36).slice(-8);
            const hash = await bcrypt.hash(randomPwd, 10);
            newUser = await User.create({
              name: displayName,
              email,
              password: hash,
              role: "google_user"
            });
            return done(null, {
              id: newUser.id,
              name: newUser.name,
              email: newUser.email,
              role: newUser.role
            });
          }
          return await done(null, user); //done第一個參數為錯誤 第二個為使用者(給session)
        })
        .catch((error) => {
          error.errorMessage = "使用GOOGLE登入失敗";
          done(error);
        });
    }
  )
);


passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  profileFields: ['email', 'displayName']
}, (accessToken, refreshToken, profile, done) => {
  const email = profile.emails[0].value
  const name = profile.displayName
  console.log(profile)
  return User.findOne({
    attributes: ['id', 'name', 'email', 'role'],
    where: { email },
    raw: true
  })
    .then((user) => {
      if (user) return done(null, user)
      const randomPwd = Math.random().toString(36).slice(-8)
      return bcrypt.hash(randomPwd, 10)
        .then((hash) => User.create({
          name,
          email,
          password: hash,
          role: 'Facebook_user'
        }))
        .then((user) => done(null, { id: user.id, name: user.name, email: user.email, role: user.role }))
    })
    .catch((error) => {
      error.errorMessage = '登入失敗'
      done(error)
    })
}))





passport.serializeUser((user, done) => {
  const { id, name, email, role } = user;
  return done(null, { id, name, email, role }); //這裡對應到登入策略done 一個user要有id ,name ,email屬性丟給session
});

passport.deserializeUser((user, done) => {
  return done(null, {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  }); //從session取出的user
});

module.exports = passport