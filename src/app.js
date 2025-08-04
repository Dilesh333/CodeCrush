const express = require("express");
const connectDB = require("./config/database");
const app = express();
const port = 3000;
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  //creating a new user instance
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User Added Successfully");
  } catch (err) {
    res.status(400).send("Error adding user: " + err.message);
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
