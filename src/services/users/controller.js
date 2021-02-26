const express = require("express");
const { verifyToken, generateTokens } = require("../../middlewares/tokens");
const UserModel = require("../users/schema");

exports.userLoginController = async (req, res, next) => {
  try {
    const { user } = req;
    res.send(user);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.refreshTokenController = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies.refreshToken;
    const decoded = verifyToken(refreshToken, "refresh");
    const user = await UserModel.findById(decoded.id);
    const isRefreshValid = user.refreshToken == refreshToken;
    if (!isRefreshValid) throw new Error("Refresh token not valid");
    const tokens = generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    res.cookie("accessToken", tokens.accessToken, { httpOnly: true });
    res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true });
  } catch (error) {
    const err = new Error("You are not authorized");
    err.code = 401;
    next(error);
  }
};

exports.userLogoutController = async (req, res, next) => {
  try {
    console.log("clearcookies");
    res.clearCookie("accessToken", { httpOnly: true });
    res.clearCookie("refreshToken", { httpOnly: true });
    res.redirect("http://localhost:3001");
  } catch (error) {
    console.log(error);
    next(error);
  }
};
