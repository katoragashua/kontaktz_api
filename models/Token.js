const { Schema, default: mongoose } = require("mongoose");

const TokenSchema = new Schema(
  {
    refreshToken: {
      type: String,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("token", TokenSchema);
