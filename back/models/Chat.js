// models/Chat.js
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Organizer or Vendor
        required: true,
      },
    ],
    lastMessage: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
