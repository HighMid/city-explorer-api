require('dotenv').config();
const express = require('express');
const cors = require('cors');
const getWeather = require('./lib/weather');
const getMovies = require('./lib/movies');
const app = express();

// Middlewares

app.use(handleError);
app.use(cors());


app.get('/weather', getWeather);
app.get('/movies', getMovies);


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
