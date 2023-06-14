require('dotenv').config();

const express = require("express");
const cors = require("cors");
const PORT = process.env.port || 3500;
const mongoose = require("mongoose");
const notFoundHandler = require('./middleware/404');
const errorHandler = require('./middleware/500');
const userRouter = require('./routes/userRouter');



const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome");
});
app.get("*", notFoundHandler);
app.use(errorHandler);
app.use(userRouter);
// app.use('*',notFoundHandler);
// app.use(errorHandler);

module.exports = {
  server: app,
  start: () => {
    mongoose
      .connect(process.env.mongooseURL, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        app.listen(PORT, () => {
          console.log(`Starting server on port ${PORT}`);
        });
      });      
  },
};