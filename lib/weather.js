require('dotenv').config();
const API = process.env.API_KEY;
const axios = require('axios');


async function getWeather(request, response, next){
        try
    {
        const { lat, lon } = request.query;

        console.log(lat);

        if (!lat || !lon){
            return response.status(400).send('Latitude and Longitude are required');
        }

        const url = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${API}&include=minutely`;


        const weatherQuery = await axios.get(url);
        
        const forecast = weatherQuery.data.data.map(item => new Forecast(item));

        response.json(forecast);

    }catch (error){
        console.error("Error:", error);
        next(error);
    }
}

class Forecast {
    constructor(weatherData) {
        this.lat = weatherData.lat;
        this.lon = weatherData.lon;
        this.date = weatherData.datetime;
        this.description = `Average temperature of ${weatherData.max_temp} Celsius, with ${weatherData.weather.description}`;
    }
}

module.exports = getWeather;
