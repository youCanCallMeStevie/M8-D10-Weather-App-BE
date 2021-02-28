const express = require("express");
const { verifyToken, generateTokens } = require("../../middlewares/tokens");
const UserModel = require("../users/schema");

exports.userLoginController = async (req, res, next) => {
  try {
    const { user } = req;
		res.status(200).send(user);
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
    res.redirect(`${process.env.FE_URL}`);
  } catch (error) {
    console.log(error);
    next(error);
  }
};


exports.addFavCityController = async (req, res, next) => {
	try {
		const {token} = req.cookies;
		const { cityName } = req.params;
		const { _id } = await verifyToken(token);

		const user = await UserModel.findById(_id);
		user.favCities.push(cityName);
		await user.save();
		res.status(200).send(user);
	} catch (error) {
		console.log(error);
		next(error);
	}
};

exports.removeFavCityController = async (req, res, next) => {
	try {
		const {token} = req.cookies;
		const { cityName } = req.params;
		const { _id } = await verifyToken(token);

		const user = await UserModel.findById(_id);

		removeItem(user.favCities, cityName);
		await user.save();
		res.status(200).send(user);
	} catch (error) {
		console.log("fav delete error", error);
		next(error);
	}
};