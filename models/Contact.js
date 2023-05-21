const { Schema, default: mongoose } = require("mongoose");

const SocialSchema = new Schema({
  instagram: { type: String, default: null },
  facebook: { type: String, default: null },
  twitter: { type: String, default: null },
  linkedin: { type: String, default: null },
});

const WorkSchema = new Schema({
  company: { type: String, default: null },
  city: {
    type: String,
    default: null,
  },
  country: {
    type: String,
    default: null,
  },
});

const HomeSchema = new Schema({
  address: { type: String, default: null },
  city: {
    type: String,
    default: null,
  },
  country: {
    type: String,
    default: null,
  },
});

const ContactSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "Please enter firstname."],
    trim: true,
    maxlength: 30,
  },
  middlename: {
    type: String,
    trim: true,
    maxlength: 30,
  },
  name: {
    type: String,
  },
  lastname: {
    type: String,
    trim: true,
    maxlength: 30,
  },
  title: {
    type: String,
    lowercase: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "prefer not to say"],
    default: "prefer not to say",
  },
  phone: {
    type: Number,
    required: [true, "Please enter a phone number."],
    unique: true,
  },
  alt_phone: {
    type: Number,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    maxlength: 30,
  },
  alt_email: {
    type: String,
    trim: true,
  },
  birthday: {
    type: Date,
  },
  relationship: {
    type: String,
    enum: ["friend", "family", "mutual-friend", "colleague", "other"],
    default: "other",
  },
  photo: { type: String },
  home: {
    type: HomeSchema,
    default: {},
  },
  work: {
    type: WorkSchema,
    default: {},
  },
  social: {
    type: SocialSchema,
    default: {},
  },
  description: {
    type: String,
    required: [true, "Please add a description, eg. How/where you met."],
    trim: true,
    maxlength: 200,
  },
  tags: {
    type: [String],
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});
// https://youtu.be/dAIQdot-6ns

module.exports = mongoose.model("Contact", ContactSchema);
