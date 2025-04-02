const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3002;

mongoose
  .connect(`${process.env.URL_MONGOOSE}/${process.env.DBNAME}`)
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => console.log(err));

const taskRoute = require("./routes/task");
app.use("/task", taskRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
