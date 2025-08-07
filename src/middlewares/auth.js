const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  //read the token from the req cookies
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token is not valid");
    }

    //validate token
    const decordedobj = await jwt.verify(token, "Dev@Crush123");
    const { _id } = decordedobj;
    //find the user
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;

    next();
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
};

module.exports = {
  userAuth,
};
