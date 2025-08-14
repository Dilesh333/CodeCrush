const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "photoUrl",
      "age",
      "gender",
      "about",
    ]);

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "age",
        "gender",
        "about",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "age",
        "gender",
        "about",
      ]);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ data });
  } catch (error) {
    res.send(400).send("ERROR: " + error.message);
  }
});

userRouter.get("/feed", userAuth, async(req, res)=>{
  try {
    const loggedInUser = req.user;

  const connectionRequests = await ConnectionRequest.find({
    $or:[
      {fromUserId: loggedInUser._id} , {toUserId: loggedInUser._id}
    ]
  }).select("fromUserId toUserId")

  const hideUserFromFeed = new Set();
  connectionRequests.forEach((req)=>{
    hideUserFromFeed.add(req.fromUserId.toString())
    hideUserFromFeed.add(req.toUserId.toString())
  });
  
  const users = await User.find({
    $and: [
      {_id: {$nin: Array.from(hideUserFromFeed)}},
      {_id: {$ne: loggedInUser._id}}
    ]
  }).select([
        "firstName",
        "lastName",
        "photoUrl",
        "age",
        "gender",
        "about"])
  

  res.send(users)


  } catch (error) {
    res.send(400).send("ERROR: " + error.message);
  }
})

module.exports = userRouter;
