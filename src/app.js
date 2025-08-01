const express = require("express");
const connectDB = require("./config/database");
const app = express();
const port = 3000;
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Virat",
    lastName: "Kohli",
    emailId: "virat@gmail.com",
    password: "Virat@123",
  });

  
  try{
    await user.save();
    res.send("User Added Successfully");
  }
  catch(err){
    res.status(400).send("Error adding user: " + err.message);
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
