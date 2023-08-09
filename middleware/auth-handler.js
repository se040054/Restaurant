module.exports = (req,res,next)=>{
  if (req.isAuthenticated()){
    return next()
  }
  req.flash('error','請先登入')
  return res.redirect('/users/login')

}

