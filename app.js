const express = require("express");
const routes = require("./routes/routes");
const mongoose = require("mongoose");
const expressFile = require("express-fileupload");
const methodOveride = require("method-override");
const expressSession = require('express-session')
const passport = require('passport')
const connectFlash = require('connect-flash')
// creating server
// console.log(new Date().toLocaleDateString())
const app = express();
const port = 27017;

// express Layout: its for one layout, nav,footer
const expressLayout = require("express-ejs-layouts");
// const passport = require("./controllers/passport");
// const passport = require("./controllers/passport");
app.use(expressLayout);
app.set("layout", "./layouts/main-layout");

// for setting ejs
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(methodOveride("_method"));

app.use(express.urlencoded({ extended: true }));


app.use(expressSession({
  secret: 'dolomite',
  resave: true,
  saveUninitialized: true,
  maxAge: 86400000,
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(connectFlash())
app.use(function(req, res, next){
  res.locals.error = req.flash('error');
  next();
})
// cus ur saving images to your database, you need to make use of express-fileupload
app.use(expressFile());

const db = "mongodb://localhost:27017/nodetest";

mongoose
  .connect(db)
  .then(() => {
    app.listen(port, () => {
      console.log("working");
    });
  })
  .catch((err) => console.log(err));

app.use(routes);
app.use((req, res) => {
  res.status(404).render("404", { title: "error-page" });
});
