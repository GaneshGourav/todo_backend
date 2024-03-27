const jwt = require("jsonwebtoken");
const { BlacklistModel } = require("../Modals/blacklistModal");
require("dotenv").config();

const auth = async (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (token) {
    let black = await BlacklistModel.findOne({ token: token });
    if (!black) {
      jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (decoded) {
          req.body = {
            ...req.body,
            userID: decoded.userId,
            user: decoded.name,
          };
          next();
        } else {
          res.status(400).json({ msg: "Please Login First" });
        }
      });
    } else {
      res.status(400).json({ msg: "Please Login first" });
    }
  } else {
    res.status(400).json({ msg: "Please Login first" });
  }
};
module.exports = { auth };
