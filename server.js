const passport = require("passport");

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cloudinary = require("cloudinary");




const session = require("express-session");
const LocalStrategy = require('passport-local').Strategy;
const MongoStore = require("connect-mongo")(session);
const methodOverride = require("method-override");
const flash = require("express-flash");

const path = require('path');

const connectDB = require('./config/database');

const mainRoutes = require("./Routes/main");








//Use .env file in config folder
require("dotenv").config({ path: "./config/.env" });

// Passport config

cloudinary.config(process.env.CLOUDINARY_URL);

export async function handleUpload(file) {
    const res = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
    return res;
  }

//Connect To Database
connectDB();

//Using EJS for views
app.set("view engine", "ejs");

//Static Folder
//app.use(express.static("public"));
app.use('/public', express.static('public'))

//Use forms for put / delete
app.use(methodOverride("_method"));



//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());





// Setup Sessions - stored in MongoDB
app.use(
  session({
    secret: "shhhh",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

app.use(passport.initialize());
app.use(passport.session());




//Use flash messages for errors, info, ect...
app.use(flash());

require("./config/passport")(passport);

//Setup Routes For Which The Server Is Listening
app.use("/", mainRoutes);


/*app.use(function(req, res, next) {
  const requestUrl = req.originalUrl;
  res.status(404).render(path.join(__dirname, 'views', '404.ejs'), { requestUrl: requestUrl });
}); */





//Server Running
app.listen(process.env.PORT, () => {
  console.log("Server is online");
});