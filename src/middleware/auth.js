const jwt = require("jsonwebtoken");

const userModel=require('../model/userModel')
const mongoose=require('mongoose')
exports.authentication = async function (req, res, next) {
  try {
    const token = req.headers["x-api-key"];
    if (!token) {
      return res
        .status(400)
        .send({ status: false, message: "Token must be present" });
    }
    console.log("11");
    const decodedToken = jwt.verify(
      token,
      "functionup-radon",
      function (err, decodedToken) {
        if (err) return null;
        return decodedToken;
      }
    );
    if (!decodedToken)
      return res
        .status(400)
        .send({ status: false, message: "Token is invalid" });
    next();
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

exports.authorization =async function (req, res, next) {
  let token = req.headers["X-Api-key"];
  if (!token) token = req.headers["x-api-key"];
  //If no token is present in the request header return error
  if (!token)
    return res
      .status(400)
      .send({ status: false, msg: "token must be present" });
  const decodedtoken = jwt.verify(token, "functionup-radon");
  const { userId } = req.params;
  const searchForId= await userModel.findById(userId)
  if(!searchForId) return res
  .status(400)
  .send({ status: false, msg: "invalid id" });
  if (decodedtoken.userId == userId) {
    next();

  } else {
    return res.status(403).send({
      status: false,
      msg: "The Login User Are not authorize to do this actions",
    });
  }
};
