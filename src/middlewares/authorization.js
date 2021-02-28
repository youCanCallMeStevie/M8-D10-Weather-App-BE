const { verifyToken } = require("./tokens");
const UserModel = require("../services/users/schema");

exports.isAuthorized = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;
    const decoded = verifyToken(accessToken, "access");
    if (!decoded) throw new Error("Token not valid");
    const user = await UserModel.findById(decoded.id);
    if (!user) throw new Error("user not authorised with that token");
    req.user = user;
    next();
  } catch (error) {
    new Error("You are not authorized");
    error.code = 401;
    next(error);
  }
};
