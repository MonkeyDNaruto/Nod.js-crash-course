const express = require("express");
const req = require("express/lib/request");
const { get, result } = require("lodash");
const morgan = require("morgan");
const mongoose = require("mongoose");
const blogRoutes = require("./routes/blogRoutes.js");
const res = require("express/lib/response");
const { param } = require("express/lib/request");
const { render } = require("express/lib/response");
const Blog = require("./models/blog.js");

const app = express();

const dbURI = "mongodb://localhost:27017/blog";
const db = mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log("Database connection made");
  })
  .catch((err) => console.log(err));

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use((req, res, next) => {
  console.log("New request made:");
  console.log("host:", req.hostname);
  console.log("path:", req.path);
  console.log("method:", req.method);
  next();
});

app.use((req, res, next) => {
  console.log("In the next middleware");
  next();
});

app.get("/", async (req, res) => {
  const blogs = await Blog.find({}).lean();
  res.render("index", { title: "Home", blogs });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

app.post("/", (req, res) => {
  console.log(req.body);
  const blog = new Blog(req.body);

  blog
    .save()
    .then((result) => {
      res.redirect("/blogs");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/blogs", blogRoutes);

app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});

app.listen(3000);
