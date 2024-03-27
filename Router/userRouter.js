const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { userModel } = require("../Modals/userModal");
const { BlacklistModel } = require("../Modals/blacklistModal");

userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await userModel.findOne({ email });

    if (!user) {
      bcrypt.hash(password, 5, async (err, hash) => {
        if (err) {
          return res
            .status(400)
            .json({ msg: "Something went wrong, Try again...." });
        } else {
          let user = new userModel({ username, email, password: hash });
          await user.save();
          return res.status(200).json({ msg: "Account Created Successfully" });
        }
      });
    } else {
      return res
        .status(400)
        .json({ msg: "You are already registered, try to login.." });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error, Try Again..." });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await userModel.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, async (err, result) => {
        if (result) {
          let token = jwt.sign(
            { userID: user._id, name: user.username },
            process.env.SECRET,
            { expiresIn: "5d" }
          );
          res.status(200).json({
            msg: "Logged in Successfully",
            token,
            name: user.username,
          });
          setTimeout(async () => {
            try {
              const blackToken = new BlacklistModel({ token: token });
              await blackToken.save();
              res.clearCookie();
            } catch (error) {}
          }, 5 * 24 * 60 * 60 * 1000);
        } else {
          return res.status(400).json({ msg: "Wrong password !" });
        }
      });
    } else {
      return res.status(400).json({ msg: "Wrong email or not registered!" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal Server Error, Try again... " });
  }
});

userRouter.post("/logout", async (req, res) => {
  try {
    const blackToken = new BlacklistModel({ token: req.body.token });
    await blackToken.save();
    res.status(200).json({ msg: "Logged Out" });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error, Try again..." });
  }
});
module.exports = { userRouter };
