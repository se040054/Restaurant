module.exports = (error, req, res, next) => {
  console.error(error);
  req.flash("error", error.errorMessage || "伺服器出現錯誤");
  res.redirect("back");
  next(error);
  
};
