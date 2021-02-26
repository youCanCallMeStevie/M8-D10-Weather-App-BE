
const express =require('express');
const weatherRoutes = express.Router();

//method imports
const {weatherSearchController} = require("./contoller");

//endpoints

weatherRoutes.get("/search", weatherSearchController)

//exports
module.exports = weatherRoutes