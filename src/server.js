const express = require("express");
const listEndPoints = require("express-list-endpoints");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const userRoutes = require("./services/users/route")
const weatherRoutes = require("./services/weather/route")
const cookieParser = require("cookie-parser");
const {
  notFoundHandler,
  badRequestHandler,
  genericErrorHandler,
} = require("./middlewares/errorHandling");

require("./middlewares/passports");
const { PORT, FE_URL, FE_URL_PROD, MONGO_CONNECTION } = process.env;

//Initial Set-up
const server = express();
PORT || 5050;

//Middlewares
server.use(express.json());
server.use(passport.initialize());
const whiteList = [FE_URL, FE_URL_PROD];
// const corsOptions = {
//   orgin: (orgin, callback) => {
//     if (whiteList.indexOf(orgin) !== -1 || !orgin) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true, //credentials=cookies
// };
server.use(cors({origin: whiteList,
credentials: true})); //if using cookies, you can't leave cors empty
server.use(cookieParser());


//Routes
server.use("/users", userRoutes);
server.use("/weather", weatherRoutes);
//ERROR HANDLERS
server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);
console.log(listEndPoints(server));

mongoose
  .connect(MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    server.listen(PORT, () => {
      if (server.get("env") === "production")
        console.log("Server is running on CLOUD on Port: ", PORT);
      console.log("Server is running LOCALLY on Port http:localhost:", PORT);
    })
  )
  .catch(err => console.log(err));
