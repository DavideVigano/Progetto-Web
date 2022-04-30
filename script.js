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
    /*
    let temp = jsonObj.main.temp;
    temp = temp.toFixed(0);
    document.getElementById("milanTemp").innerText = temp + "°";
    */
    
    return jsonObj;
}

async function insertDescriptionWeatherByName(units,city){

    var coordinates = await getCoordinates(city);
    jsonWeather = await getWether(coordinates,units);
    console.log(jsonWeather);
    
    document.getElementById("card1-header").innerText = city + ", " + jsonWeather.sys.country;

}

let units = "C";
let city = "Milano";
insertDescriptionWeatherByName(units,city);