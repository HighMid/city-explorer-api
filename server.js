const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const weatherData = require('./data/weather.json');

class Forecast {
    constructor(date, description) {
        this.date = date;
        this.description = description;
    }
}

app.get('/weather', (request, response) => {
    try {
        const { searchQuery } = request.query;

        const city = weatherData.find(c => 
            c.city_name.toLowerCase() === searchQuery.toLowerCase());

        if (!city) {
            return response.status(404).send('City not found');
        }

        const forecasts = city.data.map(d => new Forecast(
            d.valid_date, 
            d.weather.description
            // You can add more properties here if needed
        ));

        // Add latitude and longitude to the response
        response.json({
            city: city.city_name,
            latitude: city.lat,
            longitude: city.lon,
            forecasts: forecasts
        });
    } catch (error) {
        console.error(error);
        response.status(500).send('An error occurred while processing your request');
    }
});


// app.get('/weather', (request, response) => {
//     try {
//         const { lat, lon, searchQuery } = request.query;

//         const city = weatherData.find(c => 
//             (c.lat === lat && c.lon === lon) || c.city_name.toLowerCase() === searchQuery.toLowerCase());

//         if (!city) {
//             return response.status(404).send('City not found');
//         }

//         const forecasts = city.data.map(d => new Forecast(d.valid_date, d.weather.description));

//         response.json(forecasts);
//     } catch (error) {
//         console.error(error);
//         response.status(500).send('An error occurred while processing your request');
//     }
// });

const PORT = process.env.PORT || 3000;
app.get('/', (request, response) => {
    response.send('Hello World!');
  });
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
