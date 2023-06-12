const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");

const { ensureAuth, ensureGuest } = require("../middleware/auth");

// Main Routes - simplified for now
router.get("/", homeController.getIndex);
router.get("/signUp", homeController.getSignUp);
router.get("/profile", ensureAuth, homeController.getProfile)
router.get("/bookclubs", homeController.getBookclubs)

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);

router.post("/user/profile/:_id", authController.updateUserProfile);


router.post("/signUp", authController.postSignUp); // Update the function name to postSignUp

module.exports = router;