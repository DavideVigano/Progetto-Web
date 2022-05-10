document.addEventListener('DOMContentLoaded', start());
//change visual mode 
document.getElementById("change-mode").onclick = function () {
    var element = document.body;
    element.classList.toggle("dark-mode");
    var obj = localStorage.getItem('preferances');

    obj = JSON.parse(obj);
    if (obj.darkMode == true) {
        obj.darkMode = false;

    } else {
        obj.darkMode = true;
        console.log(obj);
    }
    obj = JSON.stringify(obj);
    localStorage.setItem("preferances",obj);
}

//salvare preferenza dark-light mode
function start() {
    //verifico se oggetto presente in local storage
    var obj = localStorage.getItem('preferances');
    if (obj) {
        // oggetto presente in local storage lo prendo e lo carico
        obj = JSON.parse(obj);
        if (obj.darkMode == true) {
            document.body.classList.toggle("dark-mode");
            var toggle = document.getElementById("change-mode");
            toggle.checked = true;
        }
    }else{
        //oggetto non presento, lo creo 
        var preferance = {
            darkMode: false,
            //date: new Date().toString(),
        }
        //salvo oggetto in local storage
        preferance = JSON.stringify(preferance);
        localStorage.setItem("preferances",preferance);
    }
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

    //name country card1
    document.getElementById("card1-header").innerText = jsonWeather.name; + ", "+jsonWeather.sys.country;

    //temperature card1
    let temp = jsonWeather.main.temp;
    temp = temp.toFixed(0);
    document.getElementById("card1-temperature").innerText = temp + "°";

    //basic info card1
    let info = "";
    jsonWeather.weather.forEach(element => {
        info = info + " " + element.description;
    });
    document.getElementById("card1-info").innerText = info;

    //immage card1 
    var url = "http://openweathermap.org/img/wn/";
    var dim = "@2x.png";

    let immageCode = jsonWeather.weather[0].icon;
    immageCode = url + immageCode + dim ;
    document.getElementById("immage-c1").setAttribute("src",immageCode);

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
    var url = "Images/Icon-weather/";
    var dim = ".svg";
    console.log(arrayJsonObject[0]);
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
    probability = probability.toFixed(0);
    document.getElementById("rain-c3-c1").innerText = probability + '%';

    probability = arrayJsonObject[1].pop;
    probability = probability * 100;
    probability = probability.toFixed(0);
    document.getElementById("rain-c3-c2").innerText = probability + '%';

    probability = arrayJsonObject[2].pop;
    probability = probability * 100;
    probability = probability.toFixed(0);
    document.getElementById("rain-c3-c3").innerText = probability + '%';

    probability = arrayJsonObject[3].pop;
    probability = probability * 100;
    probability = probability.toFixed(0);
    document.getElementById("rain-c3-c4").innerText = probability + '%';

    probability = arrayJsonObject[4].pop;
    probability = probability * 100;
    probability = probability.toFixed(0);
    document.getElementById("rain-c3-c5").innerText = probability + '%';
}

function getNElemnt(N,jsonObject) {
    var arrayJsonObject = []
    for (let index = 0; index < N; index++) {
        arrayJsonObject[index] = jsonObject.list[index];
    }
    return arrayJsonObject
}

async function insertAirQualityByCordinates(coordinates,time) {
    let response = await fetch("http://api.openweathermap.org/data/2.5/air_pollution/history?lat="+coordinates.lat+"&lon="+coordinates.lon+"&start="+time.start+"&end="+time.end+"&appid=1dca80949b57093744a6ebd31d5c974b",{
        method: "GET"
    });

    let jsonObj = await response.json();
    let index = jsonObj.list[0].main.aqi;
    index = getStateOfAirQualityIndex(index);
    document.getElementById("index-c4").innerText = index;

    let value = jsonObj.list[0].components.pm2_5;
    console.log(jsonObj.list[0].components);
    value = value.toFixed(0);
    document.getElementById("value-c4").innerText = value + "%";
}

function getStateOfAirQualityIndex(index) {
    switch (index) {
        case 1:
            return "good";
        case 2:
            return "fair";
        case 3:
            return "moderate";
        case 4:
            return "poor";
        case 5:
            return "very poor";
        default:
            return "non valido";
    }
}   

let units = "C";
let city = "Milano";
let lang = "it";

let coordinates = {
    lat: 45.4642,
    lon: 9.1898,
}
data = Date.now();
let time = {
    start: 1606488670,
    end: 1606747870,
}

//geoloc
function success(pos) {
    let units = "C";
    let lang = "it";
    let crd = pos.coords;

    let coordinates = {
        lat: crd.latitude,
        lon: crd.longitude,
    }

    insertDescriptionWeatherByCoordinates(units,coordinates,lang);
    insertHourlyForcastByCoordinates(units,coordinates,lang);
}
  
function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    //default cordinates
    let units = "C";
    let lang = "it";
    let coordinates = {
        lat: 45.4642,
        lon: 9.1898,
    }
    insertDescriptionWeatherByCoordinates(units,coordinates,lang);
    insertHourlyForcastByCoordinates(units,coordinates,lang);
}

navigator.geolocation.getCurrentPosition(success, error);
//insertDescriptionWeatherByName(units,city);
//insertDescriptionWeatherByCoordinates(units,coordinates,lang);

insertAirQualityByCordinates(coordinates,time);

