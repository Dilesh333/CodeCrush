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


connectionRequestSchema.pre("save", function(next){
  const connectionRequest = this;
  
  //check if the fromUserId is same as toUserId (use this in request also)
  if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
  throw new Error("Cannot send connection request to yourself !")
}
next()
})



const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequest;