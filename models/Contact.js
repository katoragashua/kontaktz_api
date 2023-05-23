const { USE_PROXY } = require("http-status-codes");
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

const ContactSchema = new Schema(
  {
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
    nationality: { type: String, default: null },
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
  },
  { timestamps: true }
);
// https://youtu.be/dAIQdot-6ns

ContactSchema.pre("save", function (next) {
  console.log("save");
  if (!this.isModified("birthday")) return;
  this.birthday = new Date(this.birthday);
  next();
});

// ContactSchema.methods.createTags = async function () {
//   const user = this;
//   user.tags = this.description.split(" ").map((n) => n);
//     return this.save();
// };

module.exports = mongoose.model("Contact", ContactSchema);
