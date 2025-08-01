const express = require("express");
const connectDB = require("./config/database");
const app = express();
const port = 3000;
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  //creating a new user instance
  const user = new User(req.body);


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
