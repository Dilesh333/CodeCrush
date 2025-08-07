const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    res.send("connection req send");
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

module.exports = requestRouter;
