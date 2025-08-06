const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");

require("dotenv").config({
  path: [".env.local", ".env"],
});
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

const PORT = 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`https://localhost:${PORT}`);
    }),
  )
  .catch((err) => {
    console.err(err);
  });
