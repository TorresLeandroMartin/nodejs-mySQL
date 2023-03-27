const express = require("express");
const router = express.Router();

// pool refers to the database
const pool = require("../database");
const {isLoggedIn} = require('../lib/auth')

router.get("/links/add", isLoggedIn,(req, res) => {
  res.render("links/add");
});

router.post("/links/add", isLoggedIn, async (req, res) => {
  const { title, url, description } = req.body;
  const newLink = {
    title,
    url,
    description,
    user_id: req.user.id
  };
  await pool.query("INSERT INTO links set ?", [newLink]);
  req.flash('success', 'Saved');
  res.redirect("/links");
});

router.get("/links", isLoggedIn, async (req, res) => {
  const links = await pool.query("SELECT * FROM links WHERE user_id = ?", [req.user.id]);
  res.render("links/list", { links });
});

router.get("/links/delete/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM links WHERE ID = ?", [id]);
  req.flash('success', 'Deleted')
  res.redirect("/links");
});

router.get("/links/edit/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const links = await pool.query("SELECT * FROM links WHERE id = ?", [id]);
  res.render("links/edit", { link: links[0] });
});

router.post("/links/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, url } = req.body;
  const newLink = {
    title,
    description,
    url,
  };

  await pool.query("UPDATE links set ? WHERE id = ?", [newLink, id]);
  req.flash("success", "Updated");
  res.redirect("/links");
});

module.exports = router;
