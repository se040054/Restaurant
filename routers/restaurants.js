const express = require("express");
const router = express.Router();
const db = require("../models");
const Restaurant = db.Restaurant;
const { Op, or } = require("sequelize");
const restaurant = require("../models/restaurant");

router.get("/", async (req, res) => {
  const keyword = req.query.search?.trim();
  // console.log(keyword)
  let restaurants;
  const sort = req.query.sort;
  let column;
  let order;
  const userId = req.user.id;
  switch (sort) {
    case "AtoZ":
      [column, order] = ["name", "asc"];
      break;
    case "ZtoA":
      [column, order] = ["name", "desc"];
      break;
    case "類別":
      [column, order] = ["category", "asc"];
      break;
    case "地區":
      [column, order] = ["location", "desc"];
      break;
  }
  // console.log(sort)
  if (keyword) {
    restaurants = await Restaurant.findAll({
      attributes: ["id", "image", "name"],
      raw: true,
      where: {
        name: { [Op.like]: `%${keyword}%` },
        userId,
      },
      order: [[column || "name", order || "ASC"]],
    });
  } else {
    restaurants = await Restaurant.findAll({
      where: { userId },
      attributes: ["id", "image", "name"],
      raw: true,
      order: [[column || "name", order || "ASC"]],
    });
  }

  if (keyword && restaurants.length === 0) {
    return res.render("empty", { keyword });
  } else {
    return res.render("index", { keyword, restaurants, sort });
  }
});

router.get("/create", (req, res) => {
  res.render("create");
});

router.post("/", (req, res) => {
  const {
    name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description,
  } = req.body;
  const userId = req.user.id;
  return Restaurant.create({
    name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description,
    userId,
  }).then(() => res.redirect("/"));
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;
  return Restaurant.findByPk(id, {
    attributes: [
      "id",
      "name",
      "name_en",
      "category",
      "image",
      "location",
      "phone",
      "google_map",
      "rating",
      "description",
      "userId",
    ],
    raw: true,
  }).then((restaurant) => {
    if (!restaurant) {
      req.flash("error", "找不到資料");
      return res.redirect("/restaurants");
    }
    if (userId !== restaurant.userId) {
      req.flash("error", "權限不足");
      return res.redirect("/restaurants");
    }
    return res.render("detail", { restaurant });
  });
});

router.get("/:id/edit", (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;
  return Restaurant.findByPk(id, {
    attributes: [
      "id",
      "name",
      "name_en",
      "category",
      "image",
      "location",
      "phone",
      "google_map",
      "rating",
      "description",
      "userId",
    ],
    raw: true,
  }).then((restaurant) => {
    if (!restaurant) {
      req.flash("error", "找不到資料");
      return res.redirect("/restaurants");
    }
    if (userId !== restaurant.userId) {
      req.flash("error", "權限不足");
      return res.redirect("/restaurants");
    }
    return res.render("edit", { restaurant });
  });
});

router.put("/:id", (req, res) => {
  const {
    name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description,
  } = req.body;
  const id = req.params.id;
  const userId = req.user.id;

  return Restaurant.findByPk(id, {
    attributes: [
      "id",
      "name",
      "name_en",
      "category",
      "image",
      "location",
      "phone",
      "google_map",
      "rating",
      "description",
      "userId",
    ],
  }).then((restaurant) => {
    if (!restaurant) {
      req.flash("error", "找不到資料");
      return res.redirect("/restaurants");
    }
    if (userId !== restaurant.userId) {
      req.flash("error", "權限不足");
      return res.redirect("/restaurants");
    }
    return restaurant
      .update({
        name,
        name_en,
        category,
        image,
        location,
        phone,
        google_map,
        rating,
        description,
      })
      .then(() => {
        res.redirect(`${id}`);
      });
  });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;
  return Restaurant.findByPk(id, {
    attributes: ["id", "userId"],
  }).then((restaurant) => {
    if (!restaurant) {
      req.flash("error", "找不到資料");
      return res.redirect("/restaurants");
    }
    if (userId !== restaurant.userId) {
      req.flash("error", "權限不足");
      return res.redirect("/restaurants");
    }
    return restaurant.destroy().then(() => {
      req.flash("success", "刪除成功");
      return res.redirect("/restaurants"); //不要導回總路徑 會有兩層get,沒Flash
    });
  });
});

module.exports = router;
