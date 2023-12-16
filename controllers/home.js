const { default: mongoose } = require("mongoose");
const cloudinary = require("../middleware/cloudinary");
const multer = require('../middleware/multer');
const User = require("../Models/user");
const Club = require("../Models/bookclub");
const Book = require("../Models/book");
const Calendar = require('../Models/calendar');
const calendar = require("../Models/calendar");



module.exports = {
    

    getIndex: async (req, res, next) => {
      try {
        if (req.user) {
          // if logged in
          const user = await User.findById(req.user._id)
            .populate('calendar', 'title start end')
            .exec();
    
          const calendarEvents = JSON.stringify(user.calendar);
    
          res.render("index.ejs", { user: user, calendarEvents: calendarEvents });
        } else {
          // if not logged in
          res.render("index.ejs", { user: null, calendarEvents: null });
        }
      } catch (err) {
        return next(err);
      }
    },
    getReadingList: async (req, res, next) => {
      try {
        const user = await User.findById(req.user._id)
          .populate('bookClubs', 'name')
          .populate('currentBooks', 'title cover_image')
          .populate('finishedBooks', 'title cover_image')
          .exec();
    
        if (!user) {
          return res.status(404).send('User not found');
        }
    
        res.render("readingList.ejs", { user: user });
      } catch (err) {
        next(err);
      }
    },


    getAbout: (req, res) => {
        
      res.render("about.ejs", { user: req.user });
    },
    getSignUp: (req, res) => {
      res.render("signUp.ejs", { user: req.user });
    },

    getProfile: async (req, res, next) => {
        try {
          const user = await User.findById(req.user._id)
            .populate('bookClubs', 'name')
            .populate('currentBooks', 'title')
            .populate('finishedBooks', 'title cover_image')
            .populate('calendar', 'title start end')
            .exec();

            const calendarEvents = JSON.stringify(user.calendar);
      
          res.render("profile.ejs", { user: user, calendarEvents: calendarEvents});
        } catch (err) {
            return next(err);
          }
        },

      getBookclubs: async (req, res, next) => {
        try {
          const bookClubs = await Club.find().populate('currentBook');
          
          
          const name = bookClubs.name
          const _id = bookClubs._id
          const members = bookClubs.members
          
          
          res.render("bookclubs.ejs", { bookClubs, name: name, _id: _id, user: req.user, members: members});
        } catch (err) {
          return next(err);
        }
      },

      getViewProfile: async (req, res, next) => {
        try {
        
        

            const viewUser = await User.findById(req.params._id)
            .populate('bio')
            .populate('bookClubs', 'name',)
            .populate('currentBooks', 'title cover_image')
            .populate('finishedBooks', 'title cover_image')
            .exec();
            
            if(viewUser._id.equals(req.user._id)){
              res.redirect('/profile')
            } else{
            
    
            res.render("profileView.ejs", { member: viewUser, user: req.user })};
        } catch (err) {
          return next(err);
        }
      },


      getBookclubPage: async (req, res, next) => {
        try {
           
            const bookclub = await Club.findById(req.params._id)
            
            

            
            .populate('members', 'name userName _id')
            .populate('mod', 'name')
            .populate('currentBook', 'title cover_image author url startDate')
            .populate('nextBook', 'title cover_image author url')
            .populate('finishedBooks', 'title cover_image url finishDate')
            .populate('calendar', 'title start end')
            .exec();
            
            const user = await User.findById(req.user.id)
            const _id = user.id

            const calendarEvents = JSON.stringify(bookclub.calendar);
            
            
            
            
    
            res.render("bookclubPage.ejs", { bookclub: bookclub, user: user, _id: _id, calendarEvents: calendarEvents });
        } catch (err) {
          return next(err);
        }
      },
      getPendingMembers: async (req, res, next) => {
        try {
           
            const bookclub = await Club.findById(req.params._id)
            
            

            
            .populate('members', 'name userName _id')
            .populate('mod', 'name')
            .populate('currentBook', 'title cover_image author url startDate')
            .populate('nextBook', 'title cover_image author url')
            .populate('finishedBooks', 'title cover_image url finishDate')
            .populate('calendar', 'title start end')
            .populate('pendingMembers', 'name userName _id profilePic')
            .exec();
            
            
            const _id = bookclub.id

            
            
            
            
            
    
            res.render("pendingMembers.ejs", { bookclub: bookclub, _id: _id, user:req.user});
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
          if (club.isPrivate) {
            if (!club.pendingMembers.includes(userId)) {
              club.pendingMembers.push(userId);
              await club.save();
              res.redirect("/bookclubPage/" + clubId);
            } else {
              
              res.status(400).send("User is already in the pending list.");
            }
          }else{
          
      
          // Add the user to the club's members array
          club.members.push(userId);
          await club.save();
      
          // Add the club to the user's bookClubs array
          user.bookClubs.push(clubId);
          await user.save();

          if (club.currentBook) {
            user.currentBooks.push(club.currentBook);        
          }
          if (club.calendar) {
            const calendarEventIds = club.calendar.map(event => event._id);
            user.calendar.push(...calendarEventIds); // Spread the array of event IDs
          }
          await user.save();
      
          res.redirect("/bookclubPage/" + clubId);
        }} catch (err) {
          next(err);
        }
      },

      leaveClub: async (req, res, next) => {
        try {
          const userId = req.user._id; 
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
          if (club.calendar && club.calendar.length > 0) {
            user.calendar = user.calendar.filter((event) =>
              !club.calendar.includes(event)
            );
          }
          

          user.bookClubs.pull(clubId);
          await user.save();
         
      
          res.redirect("/bookclubPage/" + clubId);
        } catch (err) {
          next(err);
        }
      },

      accept: async (req, res, next) => {
        try {
          
          const pendingUserId = req.body.pendingUserId;
          const clubId = req.params._id;
      
          // Find the user and club by their IDs
          const pendingUser = await User.findById(pendingUserId);
          const club = await Club.findById(clubId);
         
      
          // Add the user to the club's members array
          club.members.push(pendingUserId);
          await club.save();
      
          // Add the club to the user's bookClubs array
          pendingUser.bookClubs.push(clubId);
          await user.save();

          if (club.currentBook) {
            pendingUser.currentBooks.push(club.currentBook);        
          }
          if (club.calendar) {
            const calendarEventIds = club.calendar.map(event => event._id);
            pendingUser.calendar.push(...calendarEventIds); // Spread the array of event IDs
          }
          await pendingUser.save();
      
          res.redirect("/bookclubPage/" + clubId);
        } catch (err) {
          next(err);
        }
      },
      deny: async (req, res, next) => {
        try {
          
          const userId = req.user._id;
          const clubId = req.params._id;
      
          // Find the user and club by their IDs
          const user = await User.findById(userId);
          const club = await Club.findById(clubId);
          if (club.isPrivate) {
            if (!club.pendingMembers.includes(userId)) {
              club.pendingMembers.push(userId);
              await club.save();
              res.redirect("/bookclubPage/" + clubId);
            } else {
              
              res.status(400).send("User is already in the pending list.");
            }
          }else{
          
      
          // Add the user to the club's members array
          club.members.push(userId);
          await club.save();
      
          // Add the club to the user's bookClubs array
          user.bookClubs.push(clubId);
          await user.save();

          if (club.currentBook) {
            user.currentBooks.push(club.currentBook);        
          }
          if (club.calendar) {
            const calendarEventIds = club.calendar.map(event => event._id);
            user.calendar.push(...calendarEventIds); // Spread the array of event IDs
          }
          await user.save();
      
          res.redirect("/bookclubPage/" + clubId);
        }} catch (err) {
          next(err);
        }
      },

      
      postNewClub: async (req, res, next) => {
        try {
          const userId = req.user._id;
          //const checkBox = document.getElementById("privateCheckbox")
          //if(checkBox.checked === 'true'){
          //    const isPrivate = true
          //}
          const isPrivate = req.body.privacyBox === 'true'
    
          const bookClub = new Club({
            name: req.body.clubName,
            desc: req.body.bio,
            clubPic: req.body.clubPic,
            members: [userId],
            mod: userId,
            isPrivate: isPrivate
            
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
           
            
            const bookData = req.body;
            

          
          const clubId = req.params._id;
      
          // Find the user and club by their IDs
         
          const club = await Club.findById(clubId).populate('members');

          
      
          // Obtaining the book data from the Open Library API
          const coverImage = bookData.cover_image
          

      
          // Create a new book instance
          const newBook = new Book({
            title: [bookData.title],
            author: [bookData.author],
            url: bookData.preview_url,
            num_pages: bookData.number_of_pages,
            editions: bookData.edition_count,
            cover_image: coverImage,
            startDate: new Date(),
          });

          
      
            const savedBook = await newBook.save();
            club.currentBook = savedBook;
            await club.save();

            club.members.forEach(async (member) => {
           
                member.currentBooks.push(club.savedBook) //NEEDS TESTING. DELETE COMMENT WHEN CONFIRMED TO WORK
                await member.save();
              });

              
                

                res.redirect("/bookclubPage/" + clubId);
                }catch (err) {
          next(err);
        }
      },

      addCurrentLink: async(req, res, next) =>{
        try{
          const clubId = req.params._id;
         
          const club = await Club.findById(clubId).populate('currentBook', 'id')
          const currentBook = club.currentBook._id

          const { url, authors, bookName} = req.body;
          const updateFields = {};

          if (url) {
            updateFields.url = url;
          }
          if (bookName) {
            updateFields.title = bookName;
          }
          if (authors) {
            updateFields.author = authors;
          }
          if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {folder:"samples"});
               
                
                
            const image = result.secure_url;
            
            updateFields.cover_image = image;
            
            
            
            
            if (result.error) {
                console.error("Cloudinary upload error:", result.error);
                throw new Error(result.error.message);
              }
          }

          const updatedBook= await Book.findByIdAndUpdate(currentBook, { $set: updateFields } ,{ new: true })
          
          if (!updatedBook) {
            // Handle the case where the book club is not found
            return res.status(404).json({ error: "Book club not found" });
          }
          res.redirect('/bookclubPage/'+ clubId)
      

        } catch (err) {
          next(err);
        }

      },
      addNextLink: async(req, res, next) =>{
        try{
          const clubId = req.params._id;
         
          const club = await Club.findById(clubId).populate('nextBook', 'id')
          const nextBook = club.nextBook._id
          const { url, bookName, authors } = req.body;
          const updateFields = {};

          if (url) {
            updateFields.url = url;
          }

          if (bookName) {
            updateFields.title = bookName;
          }
          if (authors) {
            updateFields.author = authors;
          }
          if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {folder:"samples"});
               
                
                
            const image = result.secure_url;
            
            updateFields.cover_image = image;
            
            
            
            
            if (result.error) {
                console.error("Cloudinary upload error:", result.error);
                throw new Error(result.error.message);
              }
          }

          const updatedBook= await Book.findByIdAndUpdate(nextBook, { $set: updateFields } ,{ new: true })
          
          if (!updatedBook) {
            // Handle the case where the book club is not found
            return res.status(404).json({ error: "Book club not found" });
          }
          res.redirect('/bookclubPage/'+ clubId)
      

        } catch (err) {
          next(err);
        }

      },


      addNextBook: async (req, res, next) => {
        try {
            
            
            const bookData = req.body;
            

          const userId = req.user._id; 
          const clubId = req.params._id;
      
          // Find the user and club by their IDs
          const user = await User.findById(userId);
          const club = await Club.findById(clubId);

          //console.log("userId:", user); 
          //console.log("clubId:", club); 

          const coverImage = bookData.cover_image
          
          
          

      
          // Obtain the book data from the Open Library API
          
      
          // Create a new book instance
          const newBook = new Book({
            title: [bookData.title],
            author: [bookData.author],
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
              const club = await Club.findById(clubId)
              .populate({
                path: 'members',
                populate: { path: 'finishedBooks', model: 'Book' }
              })
              .populate('currentBook');
              
              const finishedBookId = club.currentBook._id;
              
              const finishedBook = await Book.findById(finishedBookId);
              
              
               finishedBook.finishDate = new Date(); 
              await finishedBook.save();
              
              club.members.forEach(async (member) => {
                
                  member.finishedBooks.push(finishedBook);
                  member.currentBooks.pull(finishedBook) //DELTE COMMENT WHEN CONFIRMED TO WORK
                  member.currentBook = club.nextBook;
                  await member.save();
                });
              
            

      
      club.finishedBooks.push(finishedBook);
      if(club.nextBook != null || undefined){
      club.currentBook = club.nextBook;
      club.currentBook.startDate = new Date(),
      await club.save();
      }else{
        club.currentBook = null
      }


      club.nextBook = null;
      await club.save();
            
                  res.redirect("/bookclubPage/" + clubId);
                  }catch (err) {
            next(err);
          }
        },
        createEvent: async (req, res, next) => {
          try {
            const clubId = req.params._id;
            const userId = req.user._id;
            const eventData = req.body; 

            eventData.start = new Date(eventData.start);
            eventData.end = new Date(eventData.end);

            const calendar = new Calendar({
              title: eventData.title,
              start: eventData.start,
              end: eventData.end,
              eventFor: clubId,
              createdBy: userId,
            
            });

            const savedCalendar = await calendar.save();
         
            
        
            // Update the club calendar
            const club = await Club.findById(clubId);
            club.calendar.push(savedCalendar);
            await club.save();
        
            // Update member calendars
            const clubMembers = club.members;
            await User.updateMany(
              { _id: { $in: clubMembers } },
              { $push: { calendar: savedCalendar } }
            );
        
            
            res.redirect('/bookclubPage/'+ clubId)
          } catch (err) {
            console.error('Error creating event:', err);
            res.status(500).json({ success: false, message: 'Failed to create event' });
          }
        },
        deleteEvent: async (req, res, next) => {
          try {
            const clubId = req.params._id;
            const userId = req.user._id;
            const eventId = req.body._id; 

           
            const event = await Calendar.findById(eventId);
            
            //  used to ensure the user that created the event has permission to delete
            //if (event.createdBy.toString() !== userId.toString()) {
              //return res.status(403).json({ success: false, message: 'You do not have permission to delete this event' });
           // }
            
        
            // Update the club calendar
            const club = await Club.findById(clubId);
            club.calendar.pull(eventId);
            await club.save();
        
            // Update member calendars
            const clubMembers = club.members;
            await User.updateMany(
              { _id: { $in: clubMembers } },
              { $pull: { calendar: eventId } }
            );

            await event.remove();

        
            
            res.redirect('/bookclubPage/'+ clubId)
          } catch (err) {
            console.error('Error deleting event:', err);
            res.status(500).json({ success: false, message: 'Failed to delete event' });
          }
        },




      updateBookClub: async (req, res, next) => {
        try {
          const bookclub = await Club.findById(req.params._id);
          
         
             
      
          const { bio, name, Url } = req.body;
         
          
      
          // Prepare the fields to be updated
          const updateFields = {};
          
          
            
            if (req.file) {
                
                // Upload image to cloudinary
                const result = await cloudinary.uploader.upload(req.file.path, {folder:"samples"});
               
                
                
                const image = result.secure_url;
                
                updateFields.clubPic = image;
                
                
                
                
                if (result.error) {
                    console.error("Cloudinary upload error:", result.error);
                    throw new Error(result.error.message);
                  }
                
              }

           //perhaps updateFields.profilePic = result
          
          if (bio) {
            updateFields.desc = bio;
          }
          if (name) {
            updateFields.name = name;
          }
          if (Url) {
            updateFields.discordURL = Url;
          }
          
      
          // Update the book club's profile in the database
          const updatedClub = await Club.findByIdAndUpdate(req.params._id, { $set: updateFields }, { new: true });
          
          
      
          if (!updatedClub) {
            // Handle the case where the book club is not found
            return res.status(404).json({ error: "Book club not found" });
          }
      
          // Redirect to the book club page
          res.redirect('/bookclubPage/' + updatedClub._id);
        } catch (err) {
          // Handle any errors that occur during the update process
          return next(err);
        }
      }
    };



    /***    USE FOR FUTURE REFERENCE
      deletePost: async (req, res) => {
        try {
          // Find post by id
          let post = await Post.findById({ _id: req.params.id });
          // Delete image from cloudinary
          await cloudinary.uploader.destroy(post.cloudinaryId);
          // Delete post from db
          await Post.remove({ _id: req.params.id });
          console.log("Deleted Post");
          res.redirect("/profile");
        } catch (err) {
          res.redirect("/profile");
        }
      },
      ***/
    
 

