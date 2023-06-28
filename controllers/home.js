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
            .populate('finishedBooks', 'title')
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
            .populate('currentBooks', 'title cover_image')
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
            .populate('currentBook', 'title cover_image author url')
            .populate('nextBook', 'title cover_image author url')
            .populate('finishedBooks', 'title cover_image url ')
            .exec();
            const user = await User.findById(req.user.id)
            console.log(bookclub)
            
    
            res.render("bookclubPage.ejs", { bookclub: bookclub, user: user, });
        } catch (err) {
          return next(err);
        }
      },

      joinClub: async (req, res, next) => {
        try {
          const userId = req.user._id;
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
      
          // Remove the book from the user's bookClubs array
          if (club.currentBook) {
            user.currentBooks.pull(club.currentBook);
          }
          await user.save();

          user.bookClubs.pull(clubId);
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
            

          
          const clubId = req.params._id;
      
          // Find the user and club by their IDs
         
          const club = await Club.findById(clubId).populate('members');

          
      
          // Obtaining the book data from the Open Library API
          const coverImage = bookData.cover_image

      
          // Create a new book instance
          const newBook = new Book({
            title: [bookData.title],
            author: bookData.authors,
            url: bookData.preview_url,
            num_pages: bookData.number_of_pages,
            editions: bookData.edition_count,
            cover_image: coverImage
          });

          
      
            const savedBook = await newBook.save();
            club.currentBook = savedBook;
            await club.save();

            club.members.forEach(async (member) => {
           
                member.currentBook = club.savedBook;
                await member.save();
              });

              
                

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

          //console.log("userId:", user); 
          //console.log("clubId:", club); 

          const coverImage = bookData.cover_image
          
          console.log("bookData.coverImage:",bookData.cover_image)

      
          // Obtain the book data from the Open Library API
          // Assuming you have access to the book data as `bookData`
      
          // Create a new book instance
          const newBook = new Book({
            title: [bookData.title],
            author: [bookData.authors],
            url: bookData.preview_url,
            num_pages: bookData.number_of_pages,
            editions: bookData.edition_count,
            cover_image: coverImage
          });
      
            const savedBook = await newBook.save();
            club.nextBook = savedBook;
            await club.save();

            

              
                

                res.redirect("/bookclubPage/" + clubId);
                }catch (err) {
          next(err);
        }
      },

      finishBook: async (req, res, next) => {
        try {
          
            const clubId = req.params._id;
            const club = await Club.findById(clubId).populate('members');
            const finishedBook = club.currentBook._id;
            
            club.members.forEach(async (member) => {
                member.finishedBooks.push(finishedBook);
                member.currentBook = null
                member.currentBook = club.nextBook;
                await member.save();
              });
          

    
    club.finishedBooks.push(finishedBook);
    
    club.currentBook = club.nextBook;
    club.nextBook = null;
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

    
 

