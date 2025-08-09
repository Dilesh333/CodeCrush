const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: ["interested", "rejected", "ignored", "accepted"],
      message: "{VALUE} is not valid",
    },
  },
  { timestamps: true }
);

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequest;