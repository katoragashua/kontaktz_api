const mongoose = require("mongoose")

const SocialSchema = new Schema({
  instagram: { type: String, default: null },
  facebook: { type: String, default: null },
  twitter: { type: String, default: null },
  linkedin: { type: String, default: null },
});

const ContactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please enter firstname."],
    trim: true,
    maxlength: 30,
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Please enter lastname."],
    trim: true,
    maxlength: 30,
  },
  title: {
    type: String,
    enum: ["Mr", "Mrs", "Miss", "Chief", "Dr", "Eng", "Arc", "Prof", ""],
  },
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  phone: {
    type: Number,
    required: [true, "Please enter a phone number."],
  },
  alt_phone: {
    type: Number,
  },
  email: {
    type: String,
    required: [true, "Please enter a name."],
    trim: true,
    maxlength: 30,
  },
  alt_email: {
    type: String,
    trim: true,
  },
  birthday: {
    type: String,
  },
  relationship: {
    type: String,
    enum: ["friend", "family", "mutual-friend", "other"],
    default: "other",
  },
  address: {
    type: String,
    trim: true,
    maxlength: 50,
  },
  work: {
    type: String,
    trim: true,
    maxlength: 50,
  },
  social: {
    type: SocialSchema,
    default: {}
  },
  description: {
    type: String,
    required: [true, "Please add a description, eg. How/where you met."],
    trim: true,
    maxlength: 200,
  }
});
// https://youtu.be/dAIQdot-6ns