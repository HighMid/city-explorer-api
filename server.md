/* eslint-disable indent */
const express = require('express');
const cors = require('cors');
const jsonData = require('./data/weather.json');

// console.log(jsonData);
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (request, response) => {
  response.send('Hello World!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/weather', (request, response) => {


    try{
        const {lat, lon, searchQuery} = request.query;

        const forecasts = processWeatherData(jsonData, searchQuery);

        response.json({
        message: 'Weather Gottem',
        data: jsonData,
        parameter: {
            latitude: lat,
            longitude: lon,
            query: searchQuery
        }
    });
    }catch (error){
        console.log(error);
        response.status(500).json({
            message: 'Error has occurred', error: error.message
        });
    }
});

app.get('/currentweather', (request, response) =>{

    const currentweather = new Forecast();
    response.send('WIP');
    console.log(currentweather);
});

class Forecast {
    constructor(date, description, maxTemp, minTemp, humidity, windSpeed) {
        this.date = date;
        this.description = description;
        this.maxTemp = maxTemp;
        this.minTemp = minTemp;
        this.humidity = humidity;
        this.windSpeed = windSpeed;
    }
}

function processWeatherData(weatherData, searchQuery) {
    const cityData = weatherData.find(city => city.city_name.toLowerCase() === searchQuery.toLowerCase());

    if (!cityData) {
        throw new Error('City not found');
    }

    return cityData.data.map(dataPoint => {
        const date = dataPoint.valid_date;
        const description = dataPoint.weather.description;
        const maxTemp = dataPoint.max_temp;
        const minTemp = dataPoint.min_temp;
        const humidity = dataPoint.rh;
        const windSpeed = dataPoint.wind_spd;
        
        return new Forecast(date, description, maxTemp, minTemp, humidity, windSpeed);
    });
}


// Class creation, data extraction, and creation of Forecast objects

// class Forecast {
//     constructor(date, description) {
//         this.date = date;
//         this.description = description;
//         console.log(this.date, this.description);
//     }
// }


// function processWeatherData(weatherData) {
//     return weatherData.map(dataPoint => {
//         const date = dataPoint.date;
//         const description = dataPoint.description;

//         return new Forecast(date, description);
//     });
// }
