const axios = require('axios');
const {API_KEY} = process.env;
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather";
const ApiError = require('../../utils/apiError');

exports.weatherSearchController = async(req, res, next) => {
    const url =`${weatherUrl}`
    try {
        console.log("hello")
        const weather = await axios.get(url+`?q=${req.query.city}&appid=${API_KEY}`);
        console.log("req.query.city", req.query.city)
        const data = await weather.data
        if (!data){
            throw new ApiError(404, `No weather for that city found`);
        } else{
            res.status(200).json({ data })
        }
    } catch (error) {
        console.log(`Error with weatherSearchController`, error);
        next(error);
    }
}
