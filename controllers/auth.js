const passport = require("passport");
const cloudinary = require("../middleware/cloudinary");
const validator = require("validator");
const User = require("../Models/user");

exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect("/profile"); 
  }
  res.render("login", {
    title: "Login",
  });
};

exports.postLogin = async (req, res, next) => {
    const validationErrors = [];
    if (!validator.isEmail(req.body.email))
      validationErrors.push({ msg: "Please enter a valid email address." });
    if (validator.isEmpty(req.body.password))
      validationErrors.push({ msg: "Password cannot be blank." });
  
    if (validationErrors.length) {
      req.flash("errors", validationErrors);
      return res.redirect("/login");
    }
    req.body.email = validator.normalizeEmail(req.body.email, {
      gmail_remove_dots: false,
    });
  
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        req.flash("errors", { msg: `Email ${req.body.email} not found.` });
        return res.redirect("/login");
      }
      if (!user.password) {
        req.flash("errors", {
          msg:
            "Your account was registered using a sign-in provider. To enable password login, sign in using a provider, and then set a password under your user profile.",
        });
        return res.redirect("/login");
      }
  
      const isMatch = await user.comparePassword(req.body.password);
      if (isMatch) {
        req.login(user, (err) => {
          if (err) {
            return next(err);
          }
          req.flash("success", { msg: "Success! You are logged in." });
          
          res.redirect(req.session.returnTo || "/");
        });
      } else {
        req.flash("errors", { msg: "Invalid email or password." });
        res.redirect("/login");
      }
    } catch (err) {
      return next(err);
    }
  };


  exports.updateUserProfile = async (req, res, next) => {
    try {
      const userId = req.params._id; // Assuming you have authenticated the user and have access to the user object
  
      const { bio , name } = req.body;

      //const result = await cloudinary.uploader.upload(req.file.path, {folder:"samples"});
      //image: result.secure_url,
     

     
      
  
  
      // Prepare the fields to be updated
      const updateFields = {};
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {folder:"samples"});
        console.log('image:', result)
        const image = result.secure_url;
        updateFields.profilePic = image;
        if (result.error) {
          console.error("Cloudinary upload error:", result.error);
          throw new Error(result.error.message);
        }


      }
      if (bio) {
        updateFields.bio = bio;
      }
      if (name) {
        updateFields.name = name;
      }
  
      // Update the user's profile in the database
      const updatedUser = await User.findByIdAndUpdate(userId, { $set: updateFields } ,{ new: true })
      console.log('user:', updatedUser)
      if (!updatedUser) {
        // Handle the case where the user is not found
        return res.status(404).json({ error: "User not found" });
      }
  
      // Return the updated user as the response
      
      res.redirect("/profile");
      
      
    } catch (err) {
      // Handle any errors that occur during the update process
      return next(err);
    }
  };




exports.logout = (req, res) => {
  req.logout(() => {
    console.log('User has logged out.')
  })
  req.session.destroy((err) => {
    if (err)
      console.log("Error : Failed to destroy the session during logout.", err);
    req.user = null;
    res.redirect("/");
  });
};

exports.postSignUp = async (req, res, next) => {
    try {
      const validationErrors = [];
      if (!validator.isEmail(req.body.email))
        validationErrors.push({ msg: "Please enter a valid email address." });
      if (!validator.isLength(req.body.password, { min: 8 }))
        validationErrors.push({
          msg: "Password must be at least 8 characters long",
        });
      if (req.body.password !== req.body.confirmPassword)
        validationErrors.push({ msg: "Passwords do not match" });
  
      if (validationErrors.length) {
        req.flash("errors", validationErrors);
        return res.redirect("../signUp");
      }
      req.body.email = validator.normalizeEmail(req.body.email, {
        gmail_remove_dots: false,
      });
  
      const user = new User({
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        
      });
  
      const existingUser = await User.findOne({
        $or: [{ email: req.body.email }, { userName: req.body.userName }],
      }).exec();
  
      if (existingUser) {
        req.flash("errors", {
          msg: "Account with that email address or username already exists.",
        });
        return res.redirect("../signUp");
      }
  
      await user.save();
  
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    } catch (err) {
      return next(err);
    }
  };