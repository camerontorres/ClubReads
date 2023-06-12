const { default: mongoose } = require("mongoose");
const user = require("../Models/user");



module.exports = {
    

    getIndex: (req, res) => {
        
      res.render("index.ejs", { user: req.user });
    },
    getSignUp: (req, res) => {
      res.render("signUp.ejs");
    },

    getProfile: (req, res) => {
        
        res.render("profile.ejs",{ user: req.user });
      },
      getBookclubs: (req, res) => {
        
        res.render("bookclubs.ejs",{ user: req.user });
      },

 

}