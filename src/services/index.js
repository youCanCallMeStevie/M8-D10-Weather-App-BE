const express = require('express');
const userRoutes = require("./users/route")
const weatherRoutes = require("./weather/route")
const apiRouter = express.Router();

apiRouter.use("/users", userRoutes);
apiRouter.use("/weather", weatherRoutes);




module.exports = apiRouter