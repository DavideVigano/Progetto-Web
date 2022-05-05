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
async function getWether(c, units) {

    if (units == "C") {
        units = "metric" 
    }else{
        units = "standard"
    }

    let response = await fetch ("https://api.openweathermap.org/data/2.5/weather?lat="+c.lat+"&lon="+c.lon+"&appid=1dca80949b57093744a6ebd31d5c974b&units="+units,{
        method: "GET"
    });
    var jsonObj = await response.json();

    return jsonObj;
}

async function insertDescriptionWeatherByName(units,city){

    var coordinates = await getCoordinates(city);
    jsonWeather = await getWether(coordinates,units);
    console.log(jsonWeather);

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

async function insertDescriptionWeatherByCoordinates(units,coordinates){

    jsonWeather = await getWether(coordinates,units);

    //name country
    document.getElementById("card1-header").innerText = jsonWeather.name; + ", "+jsonWeather.sys.country;

    //temperature
    let temp = jsonWeather.main.temp;
    temp = temp.toFixed(0);
    document.getElementById("card1-temperature").innerText = temp + "°";

    //basic info
    document.getElementById("card1-info").innerText = jsonWeather.weather[0].main + ", " + jsonWeather.weather[0].description;

    //name country card2
    document.getElementById("card2-header").innerText = "Il meteo di oggi a "+ jsonWeather.name + " " + jsonWeather.sys.country;

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

async function insertHourlyForcastByCoordinates(units,coordinates){
    let response = await fetch("https://api.openweathermap.org/data/2.5/forecast?lat="+coordinates.lat+"&lon="+coordinates.lon+"&appid=1dca80949b57093744a6ebd31d5c974b&units="+units,{
        method: "GET"
    });

    var jsonWeather = await response.json();
    
    console.log(jsonWeather.list[0].dt_txt);

    jsonWeather.list.forEach(dt_txt => {
        console.log(dt_txt);
    });
    

}
let units = "C";
let city = "Milano";

let coordinates = {
    lat: 45.4642,
    lon: 9.1898,
}

//insertDescriptionWeatherByName(units,city);
insertDescriptionWeatherByCoordinates(units,coordinates);
insertHourlyForcastByCoordinates(units,coordinates);

