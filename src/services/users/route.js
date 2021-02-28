const express = require("express");
const passport = require("passport");
const { isAuthorized } = require("../../middlewares/authorization");
const {
  userLoginController,
  refreshTokenController,
  userLogoutController,
  addFavCityController,
  removeFavCityController
} = require("./controller");
const {
  oAuthRedirectController,
} = require("../../utils/oAuthRedirectController");
const userRoutes = express.Router();


userRoutes.get(
  "/auth/googleRedirect",
  passport.authenticate("google"),
  oAuthRedirectController
);
userRoutes.get(
  "/auth/googleLogin",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
userRoutes.get("/me", isAuthorized, userLoginController);
userRoutes.post("/auth/refresh", refreshTokenController);
userRoutes.get("/auth/logout", userLogoutController);
userRoutes.get("/favorites/:cityName", isAuthorized, addFavCityController);
userRoutes.delete("/favorites/:cityName", isAuthorized, removeFavCityController);


module.exports = userRoutes;