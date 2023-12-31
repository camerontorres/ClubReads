const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");

const { ensureAuth, ensureGuest } = require("../middleware/auth");

// Main Routes - simplified for now
router.get("/", homeController.getIndex);
router.get("/about", homeController.getAbout);
router.get("/signUp", homeController.getSignUp);
router.get("/profile", ensureAuth, homeController.getProfile)
router.get("/readingList", ensureAuth, homeController.getReadingList)
router.get("/bookclubs", homeController.getBookclubs)
router.get("/bookclubPage/:_id",ensureAuth, homeController.getBookclubPage)
router.get("/bookclubPage/:_id/pendingMembers",ensureAuth, homeController.getPendingMembers)
router.get("/profileView/:_id",ensureAuth, homeController.getViewProfile)

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);

router.post("/user/profile/:_id",upload.single("profilePic"), authController.updateUserProfile);
//upload.single("file")
router.post("/bookclubPage/:_id", upload.single("clubPic"), homeController.updateBookClub);
//upload.single("file")
router.post("/bookclubs", homeController.postNewClub);

router.post("/bookclubPage/:_id/join", ensureAuth, homeController.joinClub);
router.post("/bookclubPage/:_id/leave", ensureAuth, homeController.leaveClub);
router.post("/bookclubPage/:_id/acceptMember", ensureAuth, homeController.accept);
router.post("/bookclubPage/:_id/denyMember", ensureAuth, homeController.deny);

router.post("/bookclubPage/:_id/addBook", ensureAuth, homeController.addBook);
router.post("/bookclubPage/:_id/addCurrentLink",upload.single("bookCover"), ensureAuth, homeController.addCurrentLink);
router.post("/bookclubPage/:_id/addNextBook", ensureAuth, homeController.addNextBook);
router.post("/bookclubPage/:_id/addNextLink",upload.single("bookCover"), ensureAuth, homeController.addNextLink);

router.post("/bookclubPage/:_id/finishBook", ensureAuth, homeController.finishBook);

router.post("/bookclubPage/:_id/createEvent", ensureAuth, homeController.createEvent);
router.post("/bookclubPage/:_id/deleteEvent", ensureAuth, homeController.deleteEvent);
//router.post("/bookclubPage/:_id/editEvent", ensureAuth, homeController.editEvent);





router.post("/signUp", authController.postSignUp); // Update the function name to postSignUp

module.exports = router;