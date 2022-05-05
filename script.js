//change visual mode 
document.getElementById("change-mode").onclick = function () {
    var element = document.body;
    element.classList.toggle("dark-mode");
}

async function getCoordinates(name){
    let response = await fetch ("http://api.openweathermap.org/geo/1.0/direct?q=" + name + "&appid=1dca80949b57093744a6ebd31d5c974b",{
        method: "GET"
    });

    let jsonObj = await response.json();

    let coordinates = {
        lat: jsonObj[0].lat,
        lon: jsonObj[0].lon,
    }
    return coordinates
}
async function getWether(c, units,lang) {

    if (units == "C") {
        units = "metric" 
    }else{
        units = "standard"
    }

    let response = await fetch ("https://api.openweathermap.org/data/2.5/weather?lat="+c.lat+"&lon="+c.lon+"&appid=1dca80949b57093744a6ebd31d5c974b&units="+units+"&lang="+lang,{
        method: "GET"
    });
    var jsonObj = await response.json();

    return jsonObj;
}

async function insertDescriptionWeatherByName(units,city){

    var coordinates = await getCoordinates(city);
    jsonWeather = await getWether(coordinates,units);

    //name country
    document.getElementById("card1-header").innerText = city + ", " + jsonWeather.sys.country;

    //temperature
    let temp = jsonWeather.main.temp;
    temp = temp.toFixed(0);
    document.getElementById("card1-temperature").innerText = temp + "°";

    //basic info
    document.getElementById("card1-info").innerText = jsonWeather.weather[0].main + ", " + jsonWeather.weather[0].description;

    //name country card2
    document.getElementById("card2-header").innerText = "Il meteo di oggi a "+ city + " " + jsonWeather.sys.country;

    //temperature card2
    document.getElementById("card2-temperature").innerText = temp + "°";

    //info precise
    let feels = jsonWeather.main.feels_like;
    feels = feels.toFixed(0);

    document.getElementById("feels-like").innerText = feels + "°";
    document.getElementById("humidity").innerText = jsonWeather.main.humidity + " %";
    document.getElementById("pressure").innerText = jsonWeather.main.pressure + " mb";

    let min = jsonWeather.main.temp_max;
    let max = jsonWeather.main.temp_min;
    max = max.toFixed(0);
    min = min.toFixed(0);
    document.getElementById("max-min").innerText = max +"°/"+ min + " °" ;
    document.getElementById("visibility").innerText = jsonWeather.visibility + " km";
    document.getElementById("wind").innerText = jsonWeather.wind.speed + " km/h";


}

async function insertDescriptionWeatherByCoordinates(units,coordinates,lang){
    jsonWeather = await getWether(coordinates,units,lang);

    //name country
    document.getElementById("card1-header").innerText = jsonWeather.name; + ", "+jsonWeather.sys.country;

    //temperature
    let temp = jsonWeather.main.temp;
    temp = temp.toFixed(0);
    document.getElementById("card1-temperature").innerText = temp + "°";

    //basic info
    let info = "";

    jsonWeather.weather.forEach(element => {
        info = info + " " + element.description;
    });

    document.getElementById("card1-info").innerText = info;

    //name country card2
    document.getElementById("card2-header").innerText = "Il meteo di oggi a "+ jsonWeather.name + " " + jsonWeather.sys.country;

    //temperature card2
    document.getElementById("card2-temperature").innerText = temp + "°";

    //info
    let feels = jsonWeather.main.feels_like;
    feels = feels.toFixed(0);

    document.getElementById("feels-like").innerText = feels + "°";
    document.getElementById("humidity").innerText = jsonWeather.main.humidity + " %";
    document.getElementById("pressure").innerText = jsonWeather.main.pressure + " mb";

    let min = jsonWeather.main.temp_max;
    let max = jsonWeather.main.temp_min;
    max = max.toFixed(0);
    min = min.toFixed(0);
    document.getElementById("max-min").innerText = max +"°/"+ min + " °" ;
    document.getElementById("visibility").innerText = jsonWeather.visibility + " km";
    document.getElementById("wind").innerText = jsonWeather.wind.speed + " km/h";


}

async function insertHourlyForcastByCoordinates(units,coordinates,lang){
    if (units == "C") {
        units = "metric" 
    }else{
        units = "standard"
    }
    let response = await fetch("https://api.openweathermap.org/data/2.5/forecast?lat="+coordinates.lat+"&lon="+coordinates.lon+"&appid=1dca80949b57093744a6ebd31d5c974b&units="+units+"&lang="+lang,{
        method: "GET"
    });

    let jsonWeather = await response.json();

    // take the first 5 elements
    let arrayJsonObject =  getNElemnt(5,jsonWeather);
    //console.log(arrayJsonObject);

    //insert the hours
    document.getElementById("hour-c3-c1").innerText = 'Ora';

    let hour = arrayJsonObject[1].dt_txt
    hour = hour.substr(11,5);
    document.getElementById("hour-c3-c2").innerText = hour;

    hour = arrayJsonObject[2].dt_txt
    hour = hour.substr(11,5);
    document.getElementById("hour-c3-c3").innerText = hour;

    hour = arrayJsonObject[3].dt_txt
    hour = hour.substr(11,5);
    document.getElementById("hour-c3-c4").innerText = hour;

    hour = arrayJsonObject[4].dt_txt
    hour = hour.substr(11,5);
    document.getElementById("hour-c3-c5").innerText = hour;

    //insert temperatures
    let temperature = arrayJsonObject[0].main.temp;
    temperature = temperature.toFixed(0);
    document.getElementById("temperature-c3-c1").innerText = temperature + '°';

    temperature = arrayJsonObject[1].main.temp;
    temperature = temperature.toFixed(0);
    document.getElementById("temperature-c3-c2").innerText = temperature + '°';
    
    temperature = arrayJsonObject[2].main.temp;
    temperature = temperature.toFixed(0);
    document.getElementById("temperature-c3-c3").innerText = temperature + '°';

    temperature = arrayJsonObject[3].main.temp;
    temperature = temperature.toFixed(0);
    document.getElementById("temperature-c3-c4").innerText = temperature + '°';

    temperature = arrayJsonObject[4].main.temp;
    temperature = temperature.toFixed(0);
    document.getElementById("temperature-c3-c5").innerText = temperature + '°';

    // immage
    var url = "http://openweathermap.org/img/wn/";
    var dim = "@4x.png";

    let immageCode = arrayJsonObject[0].weather[0].icon;
    immageCode = url + immageCode + dim ;
    document.getElementById("immage-c3-c1").setAttribute("src",immageCode);

    immageCode = arrayJsonObject[1].weather[0].icon;
    immageCode = url + immageCode + dim ;
    document.getElementById("immage-c3-c2").setAttribute("src",immageCode);

    immageCode = arrayJsonObject[2].weather[0].icon;
    immageCode = url + immageCode + dim ;
    document.getElementById("immage-c3-c3").setAttribute("src",immageCode);

    immageCode = arrayJsonObject[3].weather[0].icon;
    immageCode = url + immageCode + dim ;
    document.getElementById("immage-c3-c4").setAttribute("src",immageCode);

    immageCode = arrayJsonObject[4].weather[0].icon;
    immageCode = url + immageCode + dim ;
    document.getElementById("immage-c3-c5").setAttribute("src",immageCode);
    
    //probability rain 
    let probability = arrayJsonObject[0].pop;
    probability = probability * 100;
    document.getElementById("rain-c3-c1").innerText = probability + '%';

    probability = arrayJsonObject[1].pop;
    probability = probability * 100;
    document.getElementById("rain-c3-c2").innerText = probability + '%';

    probability = arrayJsonObject[2].pop;
    probability = probability * 100;
    document.getElementById("rain-c3-c3").innerText = probability + '%';

    probability = arrayJsonObject[3].pop;
    probability = probability * 100;
    document.getElementById("rain-c3-c4").innerText = probability + '%';

    probability = arrayJsonObject[4].pop;
    probability = probability * 100;
    document.getElementById("rain-c3-c5").innerText = probability + '%';
}

function getNElemnt(N,jsonObject) {
    var arrayJsonObject = []
    for (let index = 0; index < N; index++) {
        arrayJsonObject[index] = jsonObject.list[index];
    }
    return arrayJsonObject
}
let units = "C";
let city = "Milano";
let lang = "it";

let coordinates = {
    lat: 45.4642,
    lon: 9.1898,
}

//insertDescriptionWeatherByName(units,city);
insertDescriptionWeatherByCoordinates(units,coordinates,lang);
insertHourlyForcastByCoordinates(units,coordinates,lang);

