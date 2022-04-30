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

    var  coordinates = {
        lat: jsonObj[0].lat,
        lon: jsonObj[0].lon,
    }

    console.log(coordinates);

    return coordinates;
}

async function getWether(c) {
    console.log(c);
    let response = await fetch ("https://api.openweathermap.org/data/2.5/weather?lat="+c.lat+"&lon="+c.lon+"&appid=1dca80949b57093744a6ebd31d5c974b&units=metric",{
        method: "GET"
    });
    var jsonObj = await response.json();
    console.log(jsonObj);
    let temp = jsonObj.main.temp;
    temp = temp.toFixed(0);
    document.getElementById("milanTemp").innerText = temp + "°";
}

getWether(getCoordinates("Milano"));