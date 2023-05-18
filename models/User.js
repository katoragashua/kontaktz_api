const mongoose = require("mongoose");
const Isemail = require("isemail");
const bcrypt = require("bcryptjs");

// Creating a model for users and adding some mongoose validations.
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name."],
      maxlength: [20, "Name must not exceed 20 characters"],
      minlength: 2,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [
        (val) => Isemail.validate(val),
        "Enter a valid email address.",
      ],
      trim: true,
      lowercase: true,
      maxlength: [50, "Email must not exceed 50 characters."],
      minlength: [6, "Email must not not be less than 6 characters."],
    },
    password: {
      type: String,
      required: true,
      maxlength: [6, "Password must not be less than 6 characters."],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    verified: {
      type: Date,
    },
    profilePhoto: {
      type: String,
      default: null,
    },
    passwordToken: {
      type: String,
    },
    passwordTokenExpiration: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Hashing the password
UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("User", UserSchema);
