const { default: mongoose } = require("mongoose");
const User = require("../Models/user");
const Club = require("../Models/bookclub");
const Book = require("../Models/book");



module.exports = {
    

    getIndex: (req, res) => {
        
      res.render("index.ejs", { user: req.user });
    },
    getSignUp: (req, res) => {
      res.render("signUp.ejs");
    },

    getProfile: async (req, res, next) => {
        try {
          const user = await User.findById(req.user._id)
            .populate('bookClubs', 'name')
            .populate('currentBooks', 'title')
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

      getViewProfile: async (req, res, next) => {
        try {

            const user = await User.findById(req.params._id)
            .populate('bookClubs', 'name')
            .populate('currentBooks', 'title')
            .exec();
            
    
            res.render("profileView.ejs", { user: user });
        } catch (err) {
          return next(err);
        }
      },


      getBookclubPage: async (req, res, next) => {
        try {
           
            const bookclub = await Club.findById(req.params._id)
            
            .populate('members', 'name userName')
            .populate('mod', 'name')
            .populate('currentBook', 'title')
            .populate('nextBook', 'title')
            .exec();
            const user = await User.findById(req.user._id)
            console.log(bookclub)
            
    
            res.render("bookclubPage.ejs", { bookclub: bookclub, user: user, });
        } catch (err) {
          return next(err);
        }
      },

      joinClub: async (req, res, next) => {
        try {
          const userId = req.user._id; // Assuming you're using passport for authentication
          const clubId = req.params._id;
      
          // Find the user and club by their IDs
          const user = await User.findById(userId);
          const club = await Club.findById(clubId);
          
      
          // Add the user to the club's members array
          club.members.push(userId);
          await club.save();
      
          // Add the club to the user's bookClubs array
          user.bookClubs.push(clubId);
          await user.save();

          if (club.currentBook) {
            user.currentBooks.push(club.currentBook);
            await user.save();
          }
      
          res.redirect("/bookclubPage/" + clubId);
        } catch (err) {
          next(err);
        }
      },

      leaveClub: async (req, res, next) => {
        try {
          const userId = req.user._id; // Assuming you're using passport for authentication
          const clubId = req.params._id;
      
          // Find the user and club by their IDs
          const user = await User.findById(userId);
          const club = await Club.findById(clubId);
      
          // Remove the user from the club's members array
          club.members.pull(userId);
          await club.save();
      
          // Remove the club from the user's bookClubs array
          user.bookClubs.pull(clubId);
          await user.save();
          if (club.currentBook) {
            user.currentBooks.pull(club.currentBook);
          }
          await user.save();
      
          res.redirect("/bookclubPage/" + clubId);
        } catch (err) {
          next(err);
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


      addBook: async (req, res, next) => {
        try {
            console.log("addBook route reached");
            
            const bookData = req.body;
            

          const userId = req.user._id; // Assuming you're using passport for authentication
          const clubId = req.params._id;
      
          // Find the user and club by their IDs
          const user = await User.findById(userId);
          const club = await Club.findById(clubId);

          console.log("userId:", user); // Add this line
          console.log("clubId:", club); // Add this line
      
          // Obtain the book data from the Open Library API
          // Assuming you have access to the book data as `bookData`
      
          // Create a new book instance
          const newBook = new Book({
            title: [bookData.title],
            author: bookData.authors,
            url: bookData.preview_url,
            num_pages: bookData.number_of_pages,
            editions: bookData.edition_count,
            cover_image: bookData.cover ? bookData.cover.large : "coverDefault.jpg",
          });
      
            const savedBook = await newBook.save();
            club.currentBook = savedBook;
            await club.save();
            user.currentBooks.push(savedBook);
            await user.save()

              
                

                res.redirect("/bookclubPage/" + clubId);
                }catch (err) {
          next(err);
        }
      },


      addNextBook: async (req, res, next) => {
        try {
            console.log("addBook route reached");
            
            const bookData = req.body;
            

          const userId = req.user._id; // Assuming you're using passport for authentication
          const clubId = req.params._id;
      
          // Find the user and club by their IDs
          const user = await User.findById(userId);
          const club = await Club.findById(clubId);

          console.log("userId:", user); // Add this line
          console.log("clubId:", club); // Add this line
      
          // Obtain the book data from the Open Library API
          // Assuming you have access to the book data as `bookData`
      
          // Create a new book instance
          const newBook = new Book({
            title: [bookData.title],
            author: bookData.authors,
            url: bookData.preview_url,
            num_pages: bookData.number_of_pages,
            editions: bookData.edition_count,
            cover_image: bookData.cover ? bookData.cover.large : "coverDefault.jpg",
          });
      
            const savedBook = await newBook.save();
            club.nextBook = savedBook;
            await club.save();

            

              
                

                res.redirect("/bookclubPage/" + clubId);
                }catch (err) {
          next(err);
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

    
 

