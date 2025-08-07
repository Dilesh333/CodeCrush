const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://dileshdev333:Dilesh%40333@devcrush.lukjnn8.mongodb.net/devCrush"
  );
};

module.exports = connectDB;
