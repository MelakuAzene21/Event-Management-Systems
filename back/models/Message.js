const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "senderModel",
    },
    senderModel: {
      type: String,
      required: true,
      enum: ["vendor", "organizer"],
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "receiverModel",
    },
    receiverModel: {
      type: String,
      required: true,
      enum: ["vendor", "organizer"],
    },
    text: {
      type: String,
      required: true,
    },
    readBy: [{
      userId: { type: mongoose.Schema.Types.ObjectId, required: true },
      model: { type: String, enum: ["vendor", "organizer"], required: true }
    }],
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent"
    },
    edited: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Virtual for frontend compatibility
messageSchema.virtual('content').get(function() { return this.text; });

module.exports = mongoose.model("Message", messageSchema);