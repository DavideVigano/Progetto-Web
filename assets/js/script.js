/* Seleziono la modalità di visualizzazione Drak or not */
document.addEventListener('DOMContentLoaded', start());

document.getElementById("change-mode").onclick = function () {
    var element = document.body;
    element.classList.toggle("dark-mode");
    var obj = localStorage.getItem('preferances');

    obj = JSON.parse(obj);
    if (obj.darkMode == true) {
        obj.darkMode = false;

    } else {
        obj.darkMode = true;
    }
    obj = JSON.stringify(obj);
    localStorage.setItem("preferances",obj);
}

/* salvare preferenza dark-light mode */
function start() {
    /* verifico se oggetto presente in local storage */
    var obj = localStorage.getItem('preferances');
    if (obj) {
        /* oggetto presente in local storage lo prendo e lo carico */
        obj = JSON.parse(obj);
        if (obj.darkMode == true) {
            document.body.classList.toggle("dark-mode");
            var toggle = document.getElementById("change-mode");
            toggle.checked = true;
        }
    }else{
        /* oggetto non presente */
        var preferance = {
            darkMode: false,
        }
        /* salvo oggetto in local storage */
        preferance = JSON.stringify(preferance);
        localStorage.setItem("preferances",preferance);
    }
}

/* Gestisco codici icone weather */
function checkCodeImage(imageCode){
    if (imageCode == "10d" || imageCode == "9d" || imageCode == "13d"||imageCode == "10n" || imageCode == "9n" || imageCode == "13n" ){
        return true;
    }
    return false;
}

/* funzioni API tempo */
async function getWether(c, units,lang) {

    let response = await fetch ("https://api.openweathermap.org/data/2.5/weather?lat="+c.lat+"&lon="+c.lon+"&appid=1dca80949b57093744a6ebd31d5c974b&units="+units+"&lang="+lang,{
        method: "GET"
    });
    var jsonObj = await response.json();

    return jsonObj;
}

async function getWetherDays(c,units,lang,day){

    let response = await fetch("https://api.openweathermap.org/data/2.5/forecast?lat="+c.lat+"&lon="+c.lon+"&cnt="+day+"&appid=1dca80949b57093744a6ebd31d5c974b&units="+units+"&lang="+lang,{
        method: "GET"
    });

    var jsonObj = await response.json();

    return jsonObj;
}

/* funzioni generiche */

function getNElemnt(N,jsonObject) {
    var arrayJsonObject = []
    for (let index = 0; index < N; index++) {
        arrayJsonObject[index] = jsonObject.list[index];
    }
    return arrayJsonObject
}

function getDayElement(N,jsonObject){
    var arrayJsonObject = []
    let i = 1
    for (let index = 0; index < N; index ++) {
        arrayJsonObject[index] = jsonObject.list[i];
        i = i + 8;
    }
    return arrayJsonObject
}

function getWeekDay(date) {
    let days = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
    return days[date.getDay()];
}

function getWeekDayN(timestamp){
    let date = new Date(timestamp);
    let day = getWeekDay(date);
    let num = date.getDate();
    day = day + " " + num;
    return day;
}

function getFullDay(date){
    let days = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];

    let mese = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];

    let day = days[date.getDay()] + " " + date.getDate() + " " +mese[date.getMonth()];
    return day

}


/* Pagina Index 
------------------------------------------------------------------------------------*/

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
    var url = "Images/Icon-weather/";
    var dim = ".svg";

    let imageCode = jsonWeather.weather[0].icon;
    if (checkCodeImage(imageCode)) {
        imageCode = imageCode + jsonWeather.weather[0].id;
    }

    imageCode = url + imageCode + dim ;
    document.getElementById("immage-c1").setAttribute("src",imageCode);

    //name country card2
    document.getElementById("card2-header").innerText = "Il meteo di oggi a "+ jsonWeather.name + " " + jsonWeather.sys.country;

    //temperature card2
    document.getElementById("card2-temperature").innerText = temp + "°";

    //info
    let feels = jsonWeather.main.feels_like;
    feels = feels.toFixed(0);

    document.getElementById("feels-like").innerText = feels + "°";
    document.getElementById("humidity").innerText = jsonWeather.main.humidity + "%";
    document.getElementById("pressure").innerText = jsonWeather.main.pressure + " mb";

    let min = jsonWeather.main.temp_max;
    let max = jsonWeather.main.temp_min;
    max = max.toFixed(0);
    min = min.toFixed(0);
    document.getElementById("max-min").innerText = max +"°/"+ min + "°" ;
    document.getElementById("visibility").innerText = jsonWeather.visibility + " km";
    document.getElementById("wind").innerText = jsonWeather.wind.speed + " km/h";
}

async function insertHourlyForcastByCoordinates(units,coordinates,lang){

    let jsonWeather = await getWetherDays(coordinates,units,lang,40);

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

    let imageCode = arrayJsonObject[0].weather[0].icon;
    if (checkCodeImage(imageCode)) {
        imageCode = imageCode + arrayJsonObject[0].weather[0].id;
    }
    imageCode = url + imageCode + dim ;
    document.getElementById("immage-c3-c1").setAttribute("src",imageCode);

    imageCode = arrayJsonObject[1].weather[0].icon;
    if (checkCodeImage(imageCode)) {
        imageCode = imageCode + arrayJsonObject[1].weather[0].id;
    }
    imageCode = url + imageCode + dim ;
    document.getElementById("immage-c3-c2").setAttribute("src",imageCode);

    imageCode = arrayJsonObject[2].weather[0].icon;
    if (checkCodeImage(imageCode)) {
        imageCode = imageCode + arrayJsonObject[2].weather[0].id;
    }
    imageCode = url + imageCode + dim ;
    document.getElementById("immage-c3-c3").setAttribute("src",imageCode);

    imageCode = arrayJsonObject[3].weather[0].icon;
    if (checkCodeImage(imageCode)) {
        imageCode = imageCode + arrayJsonObject[3].weather[0].id;
    }
    imageCode = url + imageCode + dim ;
    document.getElementById("immage-c3-c4").setAttribute("src",imageCode);

    imageCode = arrayJsonObject[4].weather[0].icon;
    if (checkCodeImage(imageCode)) {
        imageCode = imageCode + arrayJsonObject[4].weather[0].id;
    }
    imageCode = url + imageCode + dim ;
    document.getElementById("immage-c3-c5").setAttribute("src",imageCode);
    
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

async function insertDayForcastByCoordinates(units,coordinates,lang){

    let jsonWeather = await getWetherDays(coordinates,units,lang,40);

    let arrayJsonObject =  getDayElement(5,jsonWeather);

    // inserisci il giorno 
    
    document.getElementById("day-c4-c1").innerText = 'Oggi';

    let day = getWeekDayN(arrayJsonObject[1].dt * 1000);
    document.getElementById("day-c4-c2").innerText = day;

    day = getWeekDayN(arrayJsonObject[2].dt * 1000);
    document.getElementById("day-c4-c3").innerText = day;

    day = getWeekDayN(arrayJsonObject[3].dt * 1000);
    document.getElementById("day-c4-c4").innerText = day;

    day = getWeekDayN(arrayJsonObject[4].dt * 1000);
    document.getElementById("day-c4-c5").innerText = day;

    //insert temperatures
    let temperature = arrayJsonObject[0].main.temp;
    temperature = temperature.toFixed(0);
    document.getElementById("temperature-c4-c1").innerText = temperature + '°';

    temperature = arrayJsonObject[1].main.temp;
    temperature = temperature.toFixed(0);
    document.getElementById("temperature-c4-c2").innerText = temperature + '°';
    
    temperature = arrayJsonObject[2].main.temp;
    temperature = temperature.toFixed(0);
    document.getElementById("temperature-c4-c3").innerText = temperature + '°';

    temperature = arrayJsonObject[3].main.temp;
    temperature = temperature.toFixed(0);
    document.getElementById("temperature-c4-c4").innerText = temperature + '°';

    temperature = arrayJsonObject[4].main.temp;
    temperature = temperature.toFixed(0);
    document.getElementById("temperature-c4-c5").innerText = temperature + '°';

    // immage
    var url = "Images/Icon-weather/";
    var dim = ".svg";

    let imageCode = arrayJsonObject[0].weather[0].icon;
    if (checkCodeImage(imageCode)) {
        imageCode = imageCode + arrayJsonObject[0].weather[0].id;
    }
    imageCode = url + imageCode + dim ;
    document.getElementById("immage-c4-c1").setAttribute("src",imageCode);

    imageCode = arrayJsonObject[1].weather[0].icon;
    if (checkCodeImage(imageCode)) {
        imageCode = imageCode + arrayJsonObject[1].weather[0].id;
    }
    imageCode = url + imageCode + dim ;
    document.getElementById("immage-c4-c2").setAttribute("src",imageCode);

    imageCode = arrayJsonObject[2].weather[0].icon;
    if (checkCodeImage(imageCode)) {
        imageCode = imageCode + arrayJsonObject[2].weather[0].id;
    }
    imageCode = url + imageCode + dim ;
    document.getElementById("immage-c4-c3").setAttribute("src",imageCode);

    imageCode = arrayJsonObject[3].weather[0].icon;
    if (checkCodeImage(imageCode)) {
        imageCode = imageCode + arrayJsonObject[3].weather[0].id;
    }
    imageCode = url + imageCode + dim ;
    document.getElementById("immage-c4-c4").setAttribute("src",imageCode);

    imageCode = arrayJsonObject[4].weather[0].icon;
    if (checkCodeImage(imageCode)) {
        imageCode = imageCode + arrayJsonObject[4].weather[0].id;
    }
    imageCode = url + imageCode + dim ;
    document.getElementById("immage-c4-c5").setAttribute("src",imageCode);
    
    //probability rain 
    let probability = arrayJsonObject[0].pop;
    probability = probability * 100;
    probability = probability.toFixed(0);
    document.getElementById("rain-c4-c1").innerText = probability + '%';

    probability = arrayJsonObject[1].pop;
    probability = probability * 100;
    probability = probability.toFixed(0);
    document.getElementById("rain-c4-c2").innerText = probability + '%';

    probability = arrayJsonObject[2].pop;
    probability = probability * 100;
    probability = probability.toFixed(0);
    document.getElementById("rain-c4-c3").innerText = probability + '%';

    probability = arrayJsonObject[3].pop;
    probability = probability * 100;
    probability = probability.toFixed(0);
    document.getElementById("rain-c4-c4").innerText = probability + '%';

    probability = arrayJsonObject[4].pop;
    probability = probability * 100;
    probability = probability.toFixed(0);
    document.getElementById("rain-c4-c5").innerText = probability + '%';
}

/* Pagina Orario 
------------------------------------------------------------------------------------*/

function insertDayOneByCordinates(jsonWeather) {

    var arrayJsonObject = [];
    let i = 0;
    var data = new Date(jsonWeather.list[i].dt * 1000);
    d = data.getDate();

    for (let index = 0; index < 24; index ++) {
        x = new Date(jsonWeather.list[i].dt * 1000);
        x = x.getDate();
        if(d == x){
            arrayJsonObject[index] = jsonWeather.list[i];
        }else{
            break;
        }
        i++;
    }
    // Compila intestazione
    console.log(arrayJsonObject[0]);
    document.getElementById("luogo-ora").innerText = arrayJsonObject[0].name + ", " + arrayJsonObject[0].sys.country;

    // Inserisci il giorno 
    giorno = getFullDay(data);
    document.getElementById("mostra1").innerText = giorno;

    let img = document.createElement("img");
    img.classList.add("icon-freccia");
    img.setAttribute("src","Images/General/freccia-basso.svg");
    img.setAttribute("alt","icon-freccia");

    document.getElementById("mostra1").appendChild(img);

    // Costruisci Infofrmazioni
    for ( i = 0; i < arrayJsonObject.length; i++) {
    
        /* INTESTAZIONE
        --------------------------------------------------*/

        //lista
        let listaHead = document.createElement("li");
        listaHead.classList.add("list-group-item");
        var listaId = "listaA" +i+i+i;
        listaHead.id = listaId;
        document.getElementById("insert").appendChild(listaHead);

        //riga
        let divRow = document.createElement("div");
        divRow.classList.add("row");
        var rowId = "rowHeadA" + i;
        divRow.id = rowId;
        document.getElementById(listaId).appendChild(divRow);

        //colonna1
        let divCol = document.createElement("div");
        divCol.classList.add("col","linea");
        var colId = "colHeadAx" + i;
        divCol.id = colId;
        document.getElementById(rowId).appendChild(divCol);

        //Inserisco valori
        //ora
        let span = document.createElement("span");
        span.classList.add("ora","span");
        let ora = arrayJsonObject[i].dt_txt
        let testo = document.createTextNode(ora = ora.substr(11,5));
        span.appendChild(testo);
        document.getElementById(colId).appendChild(span);

        //temp
        span = document.createElement("span");
        span.classList.add("temp","span");
        let temperature = arrayJsonObject[i].main.temp;
        temperature = temperature.toFixed(0);
        testo = document.createTextNode(temperature + "°");
        span.appendChild(testo);
        document.getElementById(colId).appendChild(span);

        //immagine
        span = document.createElement("span");
        span.classList.add("img","span");
        var spanImgId = "spanImgA" + i;
        span.id = spanImgId;
        document.getElementById(colId).appendChild(span);

        let img = document.createElement("img");
        var url = "Images/Icon-weather/";
        var dim = ".svg";

        let imageCode = arrayJsonObject[i].weather[0].icon;
        if (checkCodeImage(imageCode)) {
            imageCode = imageCode + arrayJsonObject[i].weather[0].id;
        }
        imageCode = url + imageCode + dim ;

        img.classList.add("img-head-our");
        img.setAttribute("src",imageCode);
        img.setAttribute("alt","icon-weather");

        document.getElementById(spanImgId).appendChild(img);
        testo = document.createTextNode(arrayJsonObject[i].weather[0].description);
        document.getElementById(spanImgId).appendChild(testo);

        //colonna2
        divCol = document.createElement("div");
        divCol.classList.add("col","right","colHeadAy");
        colId = "colHeadAy" + i;
        divCol.id = colId;
        document.getElementById(rowId).appendChild(divCol);

        //Inserisco valori
        //immagine
        span = document.createElement("span");
        span.classList.add("icon-pop","span");
        spanImgId = "spanIconBx" + i;
        span.id = spanImgId;
        document.getElementById(colId).appendChild(span);

        img = document.createElement("img");
        img.classList.add("icon-head-our");
        img.setAttribute("src","Images/General/pop.png");
        img.setAttribute("alt","icon-pioggia");

        document.getElementById(spanImgId).appendChild(img);
        testo = document.createTextNode((arrayJsonObject[i].pop * 100).toFixed(0) + "%");
        document.getElementById(spanImgId).appendChild(testo);

        span = document.createElement("span");
        span.classList.add("icon-vento","span");
        spanImgId = "spanIconBy" + i;
        span.id = spanImgId;
        document.getElementById(colId).appendChild(span);

        img = document.createElement("img");
        img.classList.add("icon-head-our");
        img.setAttribute("src","Images/General/vento.png");
        img.setAttribute("alt","icon-vento");

        document.getElementById(spanImgId).appendChild(img);
        testo = document.createTextNode(arrayJsonObject[i].wind.speed+ "km/h");
        document.getElementById(spanImgId).appendChild(testo);


        /* CORPO
        --------------------------------------------------*/
        //container nascosto
        let divN = document.createElement("div");
        divN.classList.add("container","nascosta1","m3","nascosto");
        divNId = "divN" + i;
        divN.id = divNId;
        document.getElementById(listaId).appendChild(divN);

        //riga 1
        divRow = document.createElement("div");
        divRow.classList.add("row");
        var rowId = "rowBodyA" + i;
        divRow.id = rowId;
        document.getElementById(divNId).appendChild(divRow);

        //colonna 1
        divCol = document.createElement("div");
        divCol.classList.add("col");
        colId = "colBodoyAx" + i;
        divCol.id = colId;
        document.getElementById(rowId).appendChild(divCol);

        //info1
        span = document.createElement("span");
        span.classList.add("icon-percepiti","spanBody");
        spanImgId = "spanIconBodyAx" + i;
        span.id = spanImgId;
        document.getElementById(colId).appendChild(span);

        img = document.createElement("img");
        img.classList.add("icon-body-our");
        img.setAttribute("src","Images/General/percepiti.svg");
        img.setAttribute("alt","icon-sole");

        document.getElementById(spanImgId).appendChild(img);
        testo = document.createTextNode("Percepiti");
        document.getElementById(spanImgId).appendChild(testo);

        var p = document.createElement("p");
        testo = document.createTextNode(arrayJsonObject[i].main.feels_like.toFixed(0) + "°");
        p.appendChild(testo);
        document.getElementById(spanImgId).appendChild(p);




        //colonna 2
        divCol = document.createElement("div");
        divCol.classList.add("col");
        colId = "colBodoyAy" + i;
        divCol.id = colId;
        document.getElementById(rowId).appendChild(divCol);

        //info2
        span = document.createElement("span");
        span.classList.add("icon-percepiti","spanBody");
        spanImgId = "spanIconBodyAy" + i;
        span.id = spanImgId;
        document.getElementById(colId).appendChild(span);

        img = document.createElement("img");
        img.classList.add("icon-body-our");
        img.setAttribute("src","Images/General/vento.png");
        img.setAttribute("alt","icon-vento");

        document.getElementById(spanImgId).appendChild(img);
        testo = document.createTextNode("Vento");
        document.getElementById(spanImgId).appendChild(testo);

        var p = document.createElement("p");
        testo = document.createTextNode(arrayJsonObject[i].wind.speed+ "km/h");
        p.appendChild(testo);
        document.getElementById(spanImgId).appendChild(p);

        //colonna 3
        divCol = document.createElement("div");
        divCol.classList.add("col");
        colId = "colBodoyAz" + i;
        divCol.id = colId;
        document.getElementById(rowId).appendChild(divCol);

        //info3
        span = document.createElement("span");
        span.classList.add("icon-percepiti","spanBody");
        spanImgId = "spanIconBodyAz" + i;
        span.id = spanImgId;
        document.getElementById(colId).appendChild(span);

        img = document.createElement("img");
        img.classList.add("icon-body-our");
        img.setAttribute("src","Images/General/umidita.svg");
        img.setAttribute("alt","icon-umidita");

        document.getElementById(spanImgId).appendChild(img);
        testo = document.createTextNode("Umidità");
        document.getElementById(spanImgId).appendChild(testo);

        var p = document.createElement("p");
        testo = document.createTextNode(arrayJsonObject[i].main.humidity+ "%");
        p.appendChild(testo);
        document.getElementById(spanImgId).appendChild(p);

        //riga 1
        divRow = document.createElement("div");
        divRow.classList.add("row");
        var rowId = "rowBodyB" + i;
        divRow.id = rowId;
        document.getElementById(divNId).appendChild(divRow);

        //colonna 1
        divCol = document.createElement("div");
        divCol.classList.add("col");
        colId = "colBodoyBx" + i;
        divCol.id = colId;
        document.getElementById(rowId).appendChild(divCol);

        //info1
        span = document.createElement("span");
        span.classList.add("icon-percepiti","spanBody");
        spanImgId = "spanIconBodyBx" + i;
        span.id = spanImgId;
        document.getElementById(colId).appendChild(span);

        img = document.createElement("img");
        img.classList.add("icon-body-our");
        img.setAttribute("src","Images/General/termometro.svg");
        img.setAttribute("alt","icon-termometro");

        document.getElementById(spanImgId).appendChild(img);
        testo = document.createTextNode("Max/Min");
        document.getElementById(spanImgId).appendChild(testo);

        var p = document.createElement("p");
        let min = arrayJsonObject[i].main.temp_max.toFixed(0);
        let max = arrayJsonObject[i].main.temp_min.toFixed(0);
        testo = document.createTextNode(max+"°/"+min+"°");
        p.appendChild(testo);
        document.getElementById(spanImgId).appendChild(p);

        //colonna 2
        divCol = document.createElement("div");
        divCol.classList.add("col");
        colId = "colBodoyBy" + i;
        divCol.id = colId;
        document.getElementById(rowId).appendChild(divCol);

        //Info 2
        span = document.createElement("span");
        span.classList.add("icon-percepiti","spanBody");
        spanImgId = "spanIconBodyBy" + i;
        span.id = spanImgId;
        document.getElementById(colId).appendChild(span);

        img = document.createElement("img");
        img.classList.add("icon-body-our");
        img.setAttribute("src","Images/General/visibilita.svg");
        img.setAttribute("alt","icon-visibilita");

        document.getElementById(spanImgId).appendChild(img);
        testo = document.createTextNode("Visibilità");
        document.getElementById(spanImgId).appendChild(testo);

        var p = document.createElement("p");
        testo = document.createTextNode(arrayJsonObject[i].visibility +" km");
        p.appendChild(testo);
        document.getElementById(spanImgId).appendChild(p);

        //colonna 3
        divCol = document.createElement("div");
        divCol.classList.add("col");
        colId = "colBodoyBz" + i;
        divCol.id = colId;
        document.getElementById(rowId).appendChild(divCol);

        //info3
        span = document.createElement("span");
        span.classList.add("icon-percepiti","spanBody");
        spanImgId = "spanIconBodyBz" + i;
        span.id = spanImgId;
        document.getElementById(colId).appendChild(span);

        img = document.createElement("img");
        img.classList.add("icon-body-our");
        img.setAttribute("src","Images/General/pressione.svg");
        img.setAttribute("alt","icon-pressione");

        document.getElementById(spanImgId).appendChild(img);
        testo = document.createTextNode("Pressione");
        document.getElementById(spanImgId).appendChild(testo);

        var p = document.createElement("p");
        testo = document.createTextNode(arrayJsonObject[i].main.pressure+ " mb");
        p.appendChild(testo);
        document.getElementById(spanImgId).appendChild(p);
    }
}

function insertDayTwoByCordinates(jsonWeather) {

    var arrayJsonObject = []
    let i = 0
    var data = new Date(jsonWeather.list[i].dt * 1000);
    d = data.getDay();
    d = d+1;

    if (d >= 7) {
        d = d - 7;
    }

    for (let index = 0; index < 24; index ++) {
        x = new Date(jsonWeather.list[index].dt * 1000);
        x = x.getDay();
        if(d == x){
            arrayJsonObject[i] = jsonWeather.list[index];
            i++;
        }
        
    }
    // Inserisci il giorno
    data = new Date(arrayJsonObject[0].dt * 1000);

    giorno = getFullDay(data);
    document.getElementById("mostra2").innerText = giorno;

    let img = document.createElement("img");
    img.classList.add("icon-freccia");
    img.setAttribute("src","Images/General/freccia-basso.svg");
    img.setAttribute("alt","icon-freccia");

    document.getElementById("mostra2").appendChild(img);

    // Costruisci Infofrmazioni
    for ( i = 0; i < arrayJsonObject.length; i++) {
    
        /* INTESTAZIONE
        --------------------------------------------------*/

        //lista
        let listaHead = document.createElement("li");
        listaHead.classList.add("list-group-item");
        var listaId = "lista2A" + i +i;
        listaHead.id = listaId;
        document.getElementById("insert2").appendChild(listaHead);

        //riga
        let divRow = document.createElement("div");
        divRow.classList.add("row");
        var rowId = "rowHead2A" + i +i;
        divRow.id = rowId;
        document.getElementById(listaId).appendChild(divRow);

        //colonna1
        let divCol = document.createElement("div");
        divCol.classList.add("col","linea");
        var colId = "colHead2Ax" + i +i;
        divCol.id = colId;
        document.getElementById(rowId).appendChild(divCol);

        //Inserisco valori
        //ora
        let span = document.createElement("span");
        span.classList.add("ora","span");
        let ora = arrayJsonObject[i].dt_txt
        let testo = document.createTextNode(ora = ora.substr(11,5));
        span.appendChild(testo);
        document.getElementById(colId).appendChild(span);

        //temp
        span = document.createElement("span");
        span.classList.add("temp","span");
        let temperature = arrayJsonObject[i].main.temp;
        temperature = temperature.toFixed(0);
        testo = document.createTextNode(temperature + "°");
        span.appendChild(testo);
        document.getElementById(colId).appendChild(span);

        //immagine
        span = document.createElement("span");
        span.classList.add("img","span");
        var spanImgId = "spanImg2A" + i +i;
        span.id = spanImgId;
        document.getElementById(colId).appendChild(span);

        let img = document.createElement("img");
        var url = "Images/Icon-weather/";
        var dim = ".svg";

        let imageCode = arrayJsonObject[i].weather[0].icon;
        if (checkCodeImage(imageCode)) {
            imageCode = imageCode + arrayJsonObject[i].weather[0].id;
        }
        imageCode = url + imageCode + dim ;

        img.classList.add("img-head-our");
        img.setAttribute("src",imageCode);
        img.setAttribute("alt","icon-weather");

        document.getElementById(spanImgId).appendChild(img);
        testo = document.createTextNode(arrayJsonObject[i].weather[0].description);
        document.getElementById(spanImgId).appendChild(testo);

        //colonna2
        divCol = document.createElement("div");
        divCol.classList.add("col","right","colHeadAy");
        colId = "colHeadAy" + i +i;
        divCol.id = colId;
        document.getElementById(rowId).appendChild(divCol);

        //Inserisco valori
        //immagine
        span = document.createElement("span");
        span.classList.add("icon-pop","span");
        spanImgId = "spanIcon2Bx" + i +i;
        span.id = spanImgId;
        document.getElementById(colId).appendChild(span);

        img = document.createElement("img");
        img.classList.add("icon-head-our");
        img.setAttribute("src","Images/General/pop.png");
        img.setAttribute("alt","icon-pioggia");

        document.getElementById(spanImgId).appendChild(img);
        testo = document.createTextNode((arrayJsonObject[i].pop * 100 ).toFixed(0)+ "%");
        document.getElementById(spanImgId).appendChild(testo);

        span = document.createElement("span");
        span.classList.add("icon-vento","span");
        spanImgId = "spanIcon2By" + i +i;
        span.id = spanImgId;
        document.getElementById(colId).appendChild(span);

        img = document.createElement("img");
        img.classList.add("icon-head-our");
        img.setAttribute("src","Images/General/vento.png");
        img.setAttribute("alt","icon-vento");

        document.getElementById(spanImgId).appendChild(img);
        testo = document.createTextNode(arrayJsonObject[i].wind.speed+ "km/h");
        document.getElementById(spanImgId).appendChild(testo);


        /* CORPO
        --------------------------------------------------*/
        //container nascosto
        let divN = document.createElement("div");
        divN.classList.add("container","nascosta2","m3","nascosto");
        divNId = "div2N" + i +i;
        divN.id = divNId;
        document.getElementById(listaId).appendChild(divN);

        //riga 1
        divRow = document.createElement("div");
        divRow.classList.add("row");
        var rowId = "rowBody2A" + i +i;
        divRow.id = rowId;
        document.getElementById(divNId).appendChild(divRow);

        //colonna 1
        divCol = document.createElement("div");
        divCol.classList.add("col");
        colId = "colBodoy2Ax" + i +i;
        divCol.id = colId;
        document.getElementById(rowId).appendChild(divCol);

        //info1
        span = document.createElement("span");
        span.classList.add("icon-percepiti","spanBody");
        spanImgId = "spanIconBody2Ax" + i +i;
        span.id = spanImgId;
        document.getElementById(colId).appendChild(span);

        img = document.createElement("img");
        img.classList.add("icon-body-our");
        img.setAttribute("src","Images/General/percepiti.svg");
        img.setAttribute("alt","icon-sole");

        document.getElementById(spanImgId).appendChild(img);
        testo = document.createTextNode("Percepiti");
        document.getElementById(spanImgId).appendChild(testo);

        var p = document.createElement("p");
        testo = document.createTextNode(arrayJsonObject[i].main.feels_like.toFixed(0) + "°");
        p.appendChild(testo);
        document.getElementById(spanImgId).appendChild(p);




        //colonna 2
        divCol = document.createElement("div");
        divCol.classList.add("col");
        colId = "colBodoy2Ay" + i +i;
        divCol.id = colId;
        document.getElementById(rowId).appendChild(divCol);

        //info2
        span = document.createElement("span");
        span.classList.add("icon-percepiti","spanBody");
        spanImgId = "spanIconBody2Ay" + i +i;
        span.id = spanImgId;
        document.getElementById(colId).appendChild(span);

        img = document.createElement("img");
        img.classList.add("icon-body-our");
        img.setAttribute("src","Images/General/vento.png");
        img.setAttribute("alt","icon-vento");

        document.getElementById(spanImgId).appendChild(img);
        testo = document.createTextNode("Vento");
        document.getElementById(spanImgId).appendChild(testo);

        var p = document.createElement("p");
        testo = document.createTextNode(arrayJsonObject[i].wind.speed+ "km/h");
        p.appendChild(testo);
        document.getElementById(spanImgId).appendChild(p);

        //colonna 3
        divCol = document.createElement("div");
        divCol.classList.add("col");
        colId = "colBodoy2Az" + i +i;
        divCol.id = colId;
        document.getElementById(rowId).appendChild(divCol);

        //info3
        span = document.createElement("span");
        span.classList.add("icon-percepiti","spanBody");
        spanImgId = "spanIconBody2Az" + i +i;
        span.id = spanImgId;
        document.getElementById(colId).appendChild(span);

        img = document.createElement("img");
        img.classList.add("icon-body-our");
        img.setAttribute("src","Images/General/umidita.svg");
        img.setAttribute("alt","icon-umidita");

        document.getElementById(spanImgId).appendChild(img);
        testo = document.createTextNode("Umidità");
        document.getElementById(spanImgId).appendChild(testo);

        var p = document.createElement("p");
        testo = document.createTextNode(arrayJsonObject[i].main.humidity+ "%");
        p.appendChild(testo);
        document.getElementById(spanImgId).appendChild(p);

        //riga 1
        divRow = document.createElement("div");
        divRow.classList.add("row");
        var rowId = "rowBody2B" + i +i;
        divRow.id = rowId;
        document.getElementById(divNId).appendChild(divRow);

        //colonna 1
        divCol = document.createElement("div");
        divCol.classList.add("col");
        colId = "colBodoy2Bx" + i +i;
        divCol.id = colId;
        document.getElementById(rowId).appendChild(divCol);

        //info1
        span = document.createElement("span");
        span.classList.add("icon-percepiti","spanBody");
        spanImgId = "spanIconBody2Bx" + i +i;
        span.id = spanImgId;
        document.getElementById(colId).appendChild(span);

        img = document.createElement("img");
        img.classList.add("icon-body-our");
        img.setAttribute("src","Images/General/termometro.svg");
        img.setAttribute("alt","icon-termometro");

        document.getElementById(spanImgId).appendChild(img);
        testo = document.createTextNode("Max/Min");
        document.getElementById(spanImgId).appendChild(testo);

        var p = document.createElement("p");
        let min = arrayJsonObject[i].main.temp_max.toFixed(0);
        let max = arrayJsonObject[i].main.temp_min.toFixed(0);
        testo = document.createTextNode(max+"°/"+min+"°");
        p.appendChild(testo);
        document.getElementById(spanImgId).appendChild(p);

        //colonna 2
        divCol = document.createElement("div");
        divCol.classList.add("col");
        colId = "colBodoy2By" + i +i;
        divCol.id = colId;
        document.getElementById(rowId).appendChild(divCol);

        //Info 2
        span = document.createElement("span");
        span.classList.add("icon-percepiti","spanBody");
        spanImgId = "spanIconBody2By" + i +i;
        span.id = spanImgId;
        document.getElementById(colId).appendChild(span);

        img = document.createElement("img");
        img.classList.add("icon-body-our");
        img.setAttribute("src","Images/General/visibilita.svg");
        img.setAttribute("alt","icon-visibilita");

        document.getElementById(spanImgId).appendChild(img);
        testo = document.createTextNode("Visibilità");
        document.getElementById(spanImgId).appendChild(testo);

        var p = document.createElement("p");
        testo = document.createTextNode(arrayJsonObject[i].visibility +" km");
        p.appendChild(testo);
        document.getElementById(spanImgId).appendChild(p);

        //colonna 3
        divCol = document.createElement("div");
        divCol.classList.add("col");
        colId = "colBodoy2Bz" + i +i;
        divCol.id = colId;
        document.getElementById(rowId).appendChild(divCol);

        //info3
        span = document.createElement("span");
        span.classList.add("icon-percepiti","spanBody");
        spanImgId = "spanIconBody2Bz" + i +i;
        span.id = spanImgId;
        document.getElementById(colId).appendChild(span);

        img = document.createElement("img");
        img.classList.add("icon-body-our");
        img.setAttribute("src","Images/General/pressione.svg");
        img.setAttribute("alt","icon-pressione");

        document.getElementById(spanImgId).appendChild(img);
        testo = document.createTextNode("Pressione");
        document.getElementById(spanImgId).appendChild(testo);

        var p = document.createElement("p");
        testo = document.createTextNode(arrayJsonObject[i].main.pressure+ " mb");
        p.appendChild(testo);
        document.getElementById(spanImgId).appendChild(p);
    }
}

function insertDayThreeByCordinates(jsonWeather) {

    var arrayJsonObject = []
    let i = 0
    var data = new Date(jsonWeather.list[i].dt * 1000);
    d = data.getDay();
    d = d+2;

    if (d >= 7) {
        d = d - 7;
    }

    console.log(d);
    for (let index = 0; index < 24; index ++) {
        x = new Date(jsonWeather.list[index].dt * 1000);
        x = x.getDay();
        if(d == x){
            arrayJsonObject[i] = jsonWeather.list[index];
            i++;
        }
        
    }
    // Inserisci il giorno
    data = new Date(arrayJsonObject[0].dt * 1000);

    giorno = getFullDay(data);
    document.getElementById("mostra3").innerText = giorno;

    let img = document.createElement("img");
    img.classList.add("icon-freccia");
    img.setAttribute("src","Images/General/freccia-basso.svg");
    img.setAttribute("alt","icon-freccia");

    document.getElementById("mostra3").appendChild(img);

    // Costruisci Infofrmazioni
    for ( i = 0; i < arrayJsonObject.length; i++) {
    
        /* INTESTAZIONE
        --------------------------------------------------*/

        //lista
        let listaHead = document.createElement("li");
        listaHead.classList.add("list-group-item");
        var listaId = "lista3A" +i+i+i;
        listaHead.id = listaId;
        document.getElementById("insert3").appendChild(listaHead);

        //riga
        let divRow = document.createElement("div");
        divRow.classList.add("row");
        var rowId = "rowHead3A" +i+i+i;
        divRow.id = rowId;
        document.getElementById(listaId).appendChild(divRow);

        //colonna1
        let divCol = document.createElement("div");
        divCol.classList.add("col","linea");
        var colId = "colHead3Ax" +i+i+i;
        divCol.id = colId;
        document.getElementById(rowId).appendChild(divCol);

        //Inserisco valori
        //ora
        let span = document.createElement("span");
        span.classList.add("ora","span");
        let ora = arrayJsonObject[i].dt_txt
        let testo = document.createTextNode(ora = ora.substr(11,5));
        span.appendChild(testo);
        document.getElementById(colId).appendChild(span);

        //temp
        span = document.createElement("span");
        span.classList.add("temp","span");
        let temperature = arrayJsonObject[i].main.temp;
        temperature = temperature.toFixed(0);
        testo = document.createTextNode(temperature + "°");
        span.appendChild(testo);
        document.getElementById(colId).appendChild(span);

        //immagine
        span = document.createElement("span");
        span.classList.add("img","span");
        var spanImgId = "spanImg3A" +i+i+i;
        span.id = spanImgId;
        document.getElementById(colId).appendChild(span);

        let img = document.createElement("img");
        var url = "Images/Icon-weather/";
        var dim = ".svg";

        let imageCode = arrayJsonObject[i].weather[0].icon;
        if (checkCodeImage(imageCode)) {
            imageCode = imageCode + arrayJsonObject[i].weather[0].id;
        }
        imageCode = url + imageCode + dim ;

        img.classList.add("img-head-our");
        img.setAttribute("src",imageCode);
        img.setAttribute("alt","icon-weather");

        document.getElementById(spanImgId).appendChild(img);
        testo = document.createTextNode(arrayJsonObject[i].weather[0].description);
        document.getElementById(spanImgId).appendChild(testo);

        //colonna2
        divCol = document.createElement("div");
        divCol.classList.add("col","right","colHeadAy");
        colId = "colHeadAy" +i+i+i;
        divCol.id = colId;
        document.getElementById(rowId).appendChild(divCol);

        //Inserisco valori
        //immagine
        span = document.createElement("span");
        span.classList.add("icon-pop","span");
        spanImgId = "spanIcon3Bx" +i+i+i;
        span.id = spanImgId;
        document.getElementById(colId).appendChild(span);

        img = document.createElement("img");
        img.classList.add("icon-head-our");
        img.setAttribute("src","Images/General/pop.png");
        img.setAttribute("alt","icon-pioggia");

        document.getElementById(spanImgId).appendChild(img);
        testo = document.createTextNode((arrayJsonObject[i].pop * 100).toFixed(0) + "%");
        document.getElementById(spanImgId).appendChild(testo);

        span = document.createElement("span");
        span.classList.add("icon-vento","span");
        spanImgId = "spanIcon3By" +i+i+i;
        span.id = spanImgId;
        document.getElementById(colId).appendChild(span);

        img = document.createElement("img");
        img.classList.add("icon-head-our");
        img.setAttribute("src","Images/General/vento.png");
        img.setAttribute("alt","icon-vento");

        document.getElementById(spanImgId).appendChild(img);
        testo = document.createTextNode(arrayJsonObject[i].wind.speed+ "km/h");
        document.getElementById(spanImgId).appendChild(testo);


        /* CORPO
        --------------------------------------------------*/
        //container nascosto
        let divN = document.createElement("div");
        divN.classList.add("container","nascosta3","m3","nascosto");
        divNId = "div3N" +i+i+i;
        divN.id = divNId;
        document.getElementById(listaId).appendChild(divN);

        //riga 1
        divRow = document.createElement("div");
        divRow.classList.add("row");
        var rowId = "rowBody3A" +i+i+i;
        divRow.id = rowId;
        document.getElementById(divNId).appendChild(divRow);

        //colonna 1
        divCol = document.createElement("div");
        divCol.classList.add("col");
        colId = "colBodoy3Ax" +i+i+i;
        divCol.id = colId;
        document.getElementById(rowId).appendChild(divCol);

        //info1
        span = document.createElement("span");
        span.classList.add("icon-percepiti","spanBody");
        spanImgId = "spanIconBody3Ax" +i+i+i;
        span.id = spanImgId;
        document.getElementById(colId).appendChild(span);

        img = document.createElement("img");
        img.classList.add("icon-body-our");
        img.setAttribute("src","Images/General/percepiti.svg");
        img.setAttribute("alt","icon-sole");

        document.getElementById(spanImgId).appendChild(img);
        testo = document.createTextNode("Percepiti");
        document.getElementById(spanImgId).appendChild(testo);

        var p = document.createElement("p");
        testo = document.createTextNode(arrayJsonObject[i].main.feels_like.toFixed(0) + "°");
        p.appendChild(testo);
        document.getElementById(spanImgId).appendChild(p);




        //colonna 2
        divCol = document.createElement("div");
        divCol.classList.add("col");
        colId = "colBodoy3Ay" +i+i+i;
        divCol.id = colId;
        document.getElementById(rowId).appendChild(divCol);

        //info2
        span = document.createElement("span");
        span.classList.add("icon-percepiti","spanBody");
        spanImgId = "spanIconBody3Ay" +i+i+i;
        span.id = spanImgId;
        document.getElementById(colId).appendChild(span);

        img = document.createElement("img");
        img.classList.add("icon-body-our");
        img.setAttribute("src","Images/General/vento.png");
        img.setAttribute("alt","icon-vento");

        document.getElementById(spanImgId).appendChild(img);
        testo = document.createTextNode("Vento");
        document.getElementById(spanImgId).appendChild(testo);

        var p = document.createElement("p");
        testo = document.createTextNode(arrayJsonObject[i].wind.speed+ "km/h");
        p.appendChild(testo);
        document.getElementById(spanImgId).appendChild(p);

        //colonna 3
        divCol = document.createElement("div");
        divCol.classList.add("col");
        colId = "colBodoy3Az" +i+i+i;
        divCol.id = colId;
        document.getElementById(rowId).appendChild(divCol);

        //info3
        span = document.createElement("span");
        span.classList.add("icon-percepiti","spanBody");
        spanImgId = "spanIconBody3Az" +i+i+i;
        span.id = spanImgId;
        document.getElementById(colId).appendChild(span);

        img = document.createElement("img");
        img.classList.add("icon-body-our");
        img.setAttribute("src","Images/General/umidita.svg");
        img.setAttribute("alt","icon-umidita");

        document.getElementById(spanImgId).appendChild(img);
        testo = document.createTextNode("Umidità");
        document.getElementById(spanImgId).appendChild(testo);

        var p = document.createElement("p");
        testo = document.createTextNode(arrayJsonObject[i].main.humidity+ "%");
        p.appendChild(testo);
        document.getElementById(spanImgId).appendChild(p);

        //riga 1
        divRow = document.createElement("div");
        divRow.classList.add("row");
        var rowId = "rowBody3B" +i+i+i;
        divRow.id = rowId;
        document.getElementById(divNId).appendChild(divRow);

        //colonna 1
        divCol = document.createElement("div");
        divCol.classList.add("col");
        colId = "colBodoy3Bx" +i+i+i;
        divCol.id = colId;
        document.getElementById(rowId).appendChild(divCol);

        //info1
        span = document.createElement("span");
        span.classList.add("icon-percepiti","spanBody");
        spanImgId = "spanIconBody3Bx" +i+i+i;
        span.id = spanImgId;
        document.getElementById(colId).appendChild(span);

        img = document.createElement("img");
        img.classList.add("icon-body-our");
        img.setAttribute("src","Images/General/termometro.svg");
        img.setAttribute("alt","icon-termometro");

        document.getElementById(spanImgId).appendChild(img);
        testo = document.createTextNode("Max/Min");
        document.getElementById(spanImgId).appendChild(testo);

        var p = document.createElement("p");
        let min = arrayJsonObject[i].main.temp_max.toFixed(0);
        let max = arrayJsonObject[i].main.temp_min.toFixed(0);
        testo = document.createTextNode(max+"°/"+min+"°");
        p.appendChild(testo);
        document.getElementById(spanImgId).appendChild(p);

        //colonna 2
        divCol = document.createElement("div");
        divCol.classList.add("col");
        colId = "colBodoy2By" +i+i+i;
        divCol.id = colId;
        document.getElementById(rowId).appendChild(divCol);

        //Info 2
        span = document.createElement("span");
        span.classList.add("icon-percepiti","spanBody");
        spanImgId = "spanIconBody3By" +i+i+i;
        span.id = spanImgId;
        document.getElementById(colId).appendChild(span);

        img = document.createElement("img");
        img.classList.add("icon-body-our");
        img.setAttribute("src","Images/General/visibilita.svg");
        img.setAttribute("alt","icon-visibilita");

        document.getElementById(spanImgId).appendChild(img);
        testo = document.createTextNode("Visibilità");
        document.getElementById(spanImgId).appendChild(testo);

        var p = document.createElement("p");
        testo = document.createTextNode(arrayJsonObject[i].visibility +" km");
        p.appendChild(testo);
        document.getElementById(spanImgId).appendChild(p);

        //colonna 3
        divCol = document.createElement("div");
        divCol.classList.add("col");
        colId = "colBodoy3Bz" +i+i+i;
        divCol.id = colId;
        document.getElementById(rowId).appendChild(divCol);

        //info3
        span = document.createElement("span");
        span.classList.add("icon-percepiti","spanBody");
        spanImgId = "spanIconBody3Bz" +i+i+i;
        span.id = spanImgId;
        document.getElementById(colId).appendChild(span);

        img = document.createElement("img");
        img.classList.add("icon-body-our");
        img.setAttribute("src","Images/General/pressione.svg");
        img.setAttribute("alt","icon-pressione");

        document.getElementById(spanImgId).appendChild(img);
        testo = document.createTextNode("Pressione");
        document.getElementById(spanImgId).appendChild(testo);

        var p = document.createElement("p");
        testo = document.createTextNode(arrayJsonObject[i].main.pressure+ " mb");
        p.appendChild(testo);
        document.getElementById(spanImgId).appendChild(p);
    }
}

/* Inserisci il vari gioni (3) in base alle coordinate */
async function insertDayByCordinates(units,coordinates,lang){
    let jsonWeather = await getWetherDays(coordinates,units,lang,24);
    insertDayOneByCordinates(jsonWeather);
    insertDayTwoByCordinates(jsonWeather);
    insertDayThreeByCordinates(jsonWeather);
}

/*  Visualizza elementi Local Storage*/
function viewStorage() {

    var coordinates = JSON.parse(localStorage.getItem('coordinate'));

    if (coordinates) {

        var l = location.pathname;
        switch (l) {
            case "/index.ejs":
                insertDescriptionWeatherByCoordinates(units,coordinates,lang);
                insertHourlyForcastByCoordinates(units,coordinates,lang);
                insertDayForcastByCoordinates(units,coordinates,lang);
                break;
            case "/orario.ejs":
                insertDayByCordinates(units,coordinates,lang);
                break;
            default:
                break;
        }
    }else{
        /* caso nessun valore in local storage utilizzo posizione correntes */
        navigator.geolocation.getCurrentPosition(success, error);
    }
}

/* Converti City name in coordinate */

async function getCoordinates(name){
    let response = await fetch ("http://api.openweathermap.org/geo/1.0/direct?q=" + name +"&limit=5" + "&appid=1dca80949b57093744a6ebd31d5c974b",{
        method: "GET"
    });

    let jsonObj = await response.json();
    console.log(jsonObj);

    let coordinates = {
        lat: jsonObj[0].lat,
        lon: jsonObj[0].lon,
    }
    return coordinates;
}

async function getNamePlace(){
    try {
        var input = document.getElementById('search1');
        coordinates = await getCoordinates(input.value);

        // salvo in local storage
        position = JSON.stringify(coordinates);
        console.log("posi "+position);
        localStorage.setItem("coordinate",position);
        console.log(localStorage.getItem('coordinate'));

        window.location.reload(true);
        
    } catch (errore) {
        alert("Il valore inserito non corrsponde a nessuna città")
    }
}


/* Funzione per Successo o Fallimento della geolocalizzazione */
function success(pos) {
    let crd = pos.coords;

    let coordinates = {
        lat: crd.latitude,
        lon: crd.longitude,
    }

    var l = location.pathname;
    switch (l) {
        case "/index.ejs":
            insertDescriptionWeatherByCoordinates(units,coordinates,lang);
            insertHourlyForcastByCoordinates(units,coordinates,lang);
            insertDayForcastByCoordinates(units,coordinates,lang);
            break;
        case "/orario.ejs":
            insertDayByCordinates(units,coordinates,lang);
            break;
        default:
            break;
    } 
}
  
function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);

    //coordinate di default 
    let coordinates = {
        lat: 45.4642,
        lon: 9.1898,
    }
    
    var l = location.pathname;
    switch (l) {
        case "/index.ejs":
            insertDescriptionWeatherByCoordinates(units,coordinates,lang);
            insertHourlyForcastByCoordinates(units,coordinates,lang);
            insertDayForcastByCoordinates(units,coordinates,lang);
            break;
        case "/orario.ejs":
            insertDayByCordinates(units,coordinates,lang);
            break;
        default:
            break;
    }
}

/* Costanti */
const units = "metric";
const lang = "IT";
const form1 = document.getElementById('form-search1');

/* Cerco valore nel LocalStorage */
document.addEventListener('DOMContentLoaded', viewStorage());

/* Ricerca dell'utente */
if(form1!= null){
    form1.addEventListener('submit', (e) => {
        e.preventDefault(); //fa si che form non ricarichi la pagina
        getNamePlace();
    })
}




