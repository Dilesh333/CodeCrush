const express = require("express");
const connectDB = require("./config/database");
const app = express();
const port = 3000;

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
