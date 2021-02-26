const axios = require('axios');
const {API_KEY} = process.env;
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather";
const ApiError = require('../../utils/apiError');

exports.weatherSearchController = async(req, res, next) => {
    const url =`${weatherUrl}`
    try {
        const res = axios.get(url+`?q=${req.query.city}&appid=${API_KEY}`);
        if (!res.ok){
            throw new ApiError(404, `No weather for that city found`);
        } else{
            res.status(200).json({ res })
        }
    } catch (error) {
        console.log(`Error with weatherSearchController`, error);
        next(error);
    }
}
