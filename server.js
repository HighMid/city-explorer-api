require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const API = process.env.API_KEY;
const movieAPI = process.env.MOVIE_API_KEY;
const app = express();


// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const axios = require('axios');
// const API = process.env.API_KEY;
// const movieAPI = process.env.MOVIE_API_KEY;
// const app = express();

// Middlewares

// app.use(cors());
// app.use(handleError);

app.use(handleError);
app.use(cors());



// Classes
class Forecast {
    constructor(weatherData) {
        this.lat = weatherData.lat;
        this.lon = weatherData.lon;
        this.date = weatherData.datetime;
        this.description = `Low of ${weatherData.low_temp} Celsius, high of ${weatherData.high_temp} Celsius, with ${weatherData.weather.description}`;
    }
}

class Movies{
    constructor(movieData){
        this.title = movieData.title;
        this.overview = movieData.overview;
        this.average_votes = movieData.vote_average;
        this.total_votes = movieData.vote_count;
        this.image_url = `https://image.tmdb.org/t/p/w500${movieData.poster_path}`;
        this.popularity = movieData.popularity;
        this.released_on = movieData.released_on;
    }
}

app.get('/weather', async (request, response, next) => {

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
});

app.get('/movies', async (request, response, next) => {
    try {
        const { city } = request.query;

        if (!city) {
            return response.status(400).send('City is required');
        }

        const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(city)}&api_key=${movieAPI}`;

        const movieResponse = await axios.get(url);
        
        const movies = movieResponse.data.results.map(item => new Movies(item));
  

        response.json(movies);

    } catch (error) {
        console.error("Error:", error);
        next(error);
    }
});

// Server Start
const PORT = process.env.PORT || 3000;
app.get('/', (request, response) => {
    response.send('Hello World!');
  });
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get('*', notFound);

// Helper Function

function notFound(request, response) {
    response.status(404).send('Not Found');
}

function handleError(error, request, response, next) {
    response.status(500).send(error.message);
}





// app.get('/weather', (request, response) => {
//     try {
//         const { searchQuery } = request.query;

//         const city = weatherData.find(c => 
//             c.city_name.toLowerCase() === searchQuery.toLowerCase());

//         if (!city) {
//             return response.status(404).send('City not found');
//         }

//         const forecasts = city.data.map(d => new Forecast(
//             d.valid_date, 
//             d.weather.description
//             // You can add more properties here if needed
//         ));

//         // Add latitude and longitude to the response
//         response.json({
//             city: city.city_name,
//             latitude: city.lat,
//             longitude: city.lon,
//             forecasts: forecasts
//         });
//     } catch (error) {
//         console.error(error);
//         response.status(500).send('An error occurred while processing your request');
//     }
// });




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

