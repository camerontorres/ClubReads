const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: { type: String, unique: true },
  email: { type: String, unique: true },
  bookClubs:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Club' }],
  currentBook: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  finishedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  profilePic: { type: String, default: 'default.jpg' },
  password: { type: String, required: true },
  
  

});

// Password hash middleware.

userSchema.pre("save", function save(next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

// Helper method for validating user's password.

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };

module.exports = mongoose.model("User", userSchema); 