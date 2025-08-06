const express = require("express");
const connectDB = require("./config/database");
const app = express();
const port = 3000;
const User = require("./models/user");
const { validateSignupData } = require("../src/utils/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    //validating the user data
    validateSignupData(req);

    // encrypt password
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    //creating a new user instance
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("User Added Successfully");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      res.send("Invalid Credential");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      //create JWT token
      const token = jwt.sign({ _id: user._id }, "Dev@Crush123");
      

      //add the token to cookie and send the response back to user
      res.cookie("token", token);

      res.send("Login Successfully!!!");
    } else {
      res.send("Invalid Credential");
    }
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

//profile APi
app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      throw new Error("No token found");
    }

    //validate the token
    const decordedMessage = await jwt.verify(token, "Dev@Crush123");
    const {_id} = decordedMessage;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    res.send(user); 
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

//find user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  console.log(userEmail);

  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//feed API -GET /feed- get all the user from db
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(404).send("something went wrong");
  }
});

//delete user by userId
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User Deleted Sucessfully!");
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

//update the userbyID
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["photoUrl", "About", "skills"];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    if (data.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    res.send("User updated successfuly!");
  } catch (error) {
    res.status(400).send("Update failed: " + error.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(port, () => {
      console.log(`server successfully running`);
    });
  })
  .catch((err) => {
    console.log("Database connection failed");
  });
