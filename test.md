require('dotenv').config();
const cors = require('cors');
const express = require('express');
const axios = require('axios');

const app = express();

const PORT = process.env.PORT || 3000;


// Middlewares

app.use(cors());

// Routes

app.get('/dong', (request, response) => {
    response.send('ping');
});

// Getting the request, located in query, the request is the searchquery.

app.get('/PICS', async (request, response, next) => {
   const query = request.query.searchquery;
   response.json(query); 
    try{
        const url = `https://www.googleapis.com/customsearch/v1?key=${process.env.API_KEY}&cx=${process.env.CONTEXT_KEY}&q=${query}`;

        const reponse = await axios.get(url);

        response.json(reponse.data);

    }catch (error){
        next(error);
    }

});

app.get('*', notFound);


// Helper functions

function notFound(request, response){
    response.status(404).send('Not Found');
}

function errorhandle(error, request, reponse, next){
    reponse.status(500).send(error.message);
}

// Classes

class Test {
    constructor(object) {
        this.name = object.name;
        this.url = object.url;
        this.image = object.image;
    }
}

// Server Start
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
