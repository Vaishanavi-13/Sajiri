const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://saipatukale13_db_user:YOUR_PASSWORD@project01.spamref.mongodb.net/sajiri?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("CONNECTED");
    process.exit(0);
  })
  .catch((err) => {
    console.log("ERROR:", err);
    process.exit(1);
  });