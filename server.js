const express = require('express');
const bodyParser = require('body-parser')
const axios = require('axios');
const path = require('path');

// Configure dotenv package
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8080;
const apiKeyOpenWeather = process.env.API_KEY_OPENWEATHER;

// Valori per DB
const MongoClient = require('mongodb').MongoClient;
const DBUrl = process.env.DB_CONNECTION;
const DBName = process.env.DB_NAME;
const mongoClient = new MongoClient(DBUrl);

// parse application/x-www-form-urlencoded
/**
 * app.use(bp.json())esamina le richieste in cui Content-Type: application/json è presente l'intestazione e trasforma l'input JSON basato su testo in variabili accessibili da JS in req.body. 
 * app.use(bp.urlencoded({extended: true})fa lo stesso per le richieste con codifica URL. il extended: true precisa che l' req.body oggetto conterrà valori di qualsiasi tipo anziché solo stringhe.
*/

app.use(express.json());
app.use(express.urlencoded({extended: false}));

/* espliciato con bodyParser (aggiungo se mi da problemi)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
*/

//Gestione file Statici 
app.use(express.static(__dirname + '/assets'));

// view engine (necessary only for openweather, webworker not)
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

//setto il display di default
app.get('/', function (req, res) {
    res.render("index", { weather: null, error: null });
    //res.render("weatherAPI")
    //res.sendFile(path.join(__dirname, '/views/weatherAPI.html'));
});

app.get('/index.ejs', function (req, res) {
    res.render("index", { weather: null, error: null });
});

app.get('/orario.ejs', function (req, res) {
    res.render("orario", { weather: null, error: null });
});



app.get('/weatherAPI', function (req, res) {
    res.render("weatherAPI", { weather: null, error: null });
    //res.render("weatherAPI")
    //res.sendFile(path.join(__dirname, '/views/weatherAPI.html'));
});

// post latitude & longitude user -> getData from openWeatherAPI
app.post('/weatherAPI', async function (req, res) {

    const latitude = parseFloat(req.body.latitude);
    const longitude = parseFloat(req.body.longitude);

    //oggetto JSON per output 
    let jsonOutput = {
        "weather": null,
        "place": null,
        "coordinates": null,
        "weatherDays": [],
        "error": null
    };

    //accedo alle API per il tempo e info città 
    const [placeInfo, forecastInfo] = await Promise
        .all(
            [
                getPlaceInfo(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKeyOpenWeather}`),

                getForecastCity(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&appid=${apiKeyOpenWeather}`, latitude, longitude)
            ])
        .catch((error) => {
            // gestione errore per accesso API tempo e/o città 
            console.log(error);
            res.render('weatherAPI', { weather: null, error: "Error" });
            res.end();
        });
    
    //aggiorno l'oggetto JSON
    jsonOutput.weather = placeInfo; 
    jsonOutput.place = `${placeInfo.name}, ${placeInfo.sys.country}`;
    // pensare se le cordinate meglio metterle come array
    jsonOutput.coordinates = `${placeInfo.coord.lat} lat, ${placeInfo.coord.lon} lon`;
    //info sul tempo 
    jsonOutput.weatherDays = forecastInfo;

    //Inserisco nel database 
    forecastInfo.forEach(element => {
        element.place = placeInfo.name;
        insertDB("cities_weather", element).catch(() => { console.error("Error on insert") });
    });

    // render output view
    res.render('weatherAPI', jsonOutput);
    res.end();
});

// metto dati nel db
// devo cambiare il percorso in modo tale che inserisco il nome delle ricerche fatte
// cerco altra utilità, magari salvo nome cità con coordinate oppure watch-list 
app.post('/showDataDB', async function (req, res) {

    // lat & long passed by user

    const latitude = parseFloat(req.body.latitude);
    const longitude = parseFloat(req.body.longitude);

    // json output

    let jsonOutput = {
        "weather": null,
        "place": null,
        "coordinates": null,
        "weatherDays": [],
        "error": null
    };

    // data from api/db after getting name of user place

    await getPlaceInfo(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKeyOpenWeather}`)
        .then(async (placeInfo) => {

            const forecastInfo = await getData("cities_weather", placeInfo.name);

            jsonOutput.weather = placeInfo;
            jsonOutput.place = `${placeInfo.name}, ${placeInfo.sys.country}`;
            jsonOutput.coordinates = `${placeInfo.coord.lat} lat, ${placeInfo.coord.lon} lon`;
            jsonOutput.weatherDays = forecastInfo;

            // render output
            res.render('weatherAPI', jsonOutput);
            res.end();
        })
        .catch((error) => {
            console.log(error);
            res.render('weatherAPI', { weather: null, error: "Error" });
            res.end();
        });
}
);

// stampo porta
app.listen(port);
console.log('Server started at http://localhost:' + port);