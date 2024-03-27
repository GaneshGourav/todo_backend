const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 5500;
require("dotenv").config();

const { connection } = require("./db");
const { userRouter } = require("./Router/userRouter");
const { notesRouter } = require("./Router/noteRouter");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/users", userRouter);
app.use("/notes", notesRouter);

app.get("/", async (req, res) => {
  res.send("Welcome to NotesApp");
});

app.listen(PORT, async () => {
  try {
    await connection;
    console.log("connected to DBS");
    console.log(`port is running at ${PORT}`);
  } catch (error) {
    console.log(error);
  }
});
