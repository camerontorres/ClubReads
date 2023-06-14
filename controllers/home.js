const { default: mongoose } = require("mongoose");
const User = require("../Models/user");
const Club = require("../Models/bookclub");



module.exports = {
    

    getIndex: (req, res) => {
        
      res.render("index.ejs", { user: req.user });
    },
    getSignUp: (req, res) => {
      res.render("signUp.ejs");
    },

    getProfile: async (req, res) => {
        try {
          const user = await User.findById(req.user._id)
            .populate('bookClubs', 'name')
            .exec();
      
          res.render("profile.ejs", { user: user });
        } catch (err) {
          return next(err);
        }
      },

      getBookclubs: async (req, res, next) => {
        try {
          const bookClubs = await Club.find();
          const name = bookClubs.name
          const _id = bookClubs._id
          res.render("bookclubs.ejs", { bookClubs, name: name, _id: _id, user: req.user });
        } catch (err) {
          return next(err);
        }
      },


      getBookclubPage: async (req, res, next) => {
        try {

            const bookclub = await Club.findById(req.params._id)
            .populate('members', 'name userName')
            .populate('mod', 'name')
            .exec();
    
            res.render("bookclubPage.ejs", { bookclub: bookclub });
        } catch (err) {
          return next(err);
        }
      },

      

    


      postNewClub: async (req, res, next) => {
        try {
          const userId = req.user._id;
    
          const bookClub = new Club({
            name: req.body.clubName,
            desc: req.body.bio,
            clubPic: req.body.clubPic,
            members: [userId],
            mod: userId,
            
          });
    
          await bookClub.save();

          const user = await User.findById(userId);
            user.bookClubs.push(bookClub._id);
            await user.save();

    
          res.redirect("/profile");
        } catch (err) {
          return next(err);
        }
      },
      updateBookClub: async (req, res, next) => {
        try {
          const bookclub = await Club.findById(req.params._id);
      
          const { profilePic, bio, name } = req.body;
      
          // Prepare the fields to be updated
          const updateFields = {};
          if (profilePic) {
            updateFields.profilePic = profilePic;
          }
          if (bio) {
            updateFields.desc = bio;
          }
          if (name) {
            updateFields.name = name;
          }
      
          // Update the book club's profile in the database
          const updatedClub = await Club.findByIdAndUpdate(bookclub, { $set: updateFields }, { new: true });
          const id = updatedClub._id
      
          if (!updatedClub) {
            // Handle the case where the book club is not found
            return res.status(404).json({ error: "Book club not found" });
          }
      
          // Redirect to the book club page
          res.redirect('/bookclubPage/' + id);
        } catch (err) {
          // Handle any errors that occur during the update process
          return next(err);
        }
      }
    };

    
 

