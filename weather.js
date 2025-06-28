const apiKey = "66df7906b7af448f954173607252206";

//main function
function init(cityName = "Saint Louis"){
    fetchWeatherData(cityName)
        .then(data => {
            displayCurrentWeather(data);
            displayHourlyWeather(data);
            displayWeeklyWeather(data);
        })

        .catch(err =>{
            console.error("Fail to fetch weather data: ", err);
            alert("Unable to retrieve weather information. Please check your network connection or city name.");
        });
}

function searchCity() {
  const cityInput = document.getElementById("input").value.trim();
  if (cityInput) {
    init(cityInput);
  } else {
    alert("Please enter region name");
  }
}

//fetch weather
function fetchWeatherData(city){
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=10&lang=en`;
    return fetch(url).then(res=>res.json());
}

//display current weather
function displayCurrentWeather(data){
    document.getElementById("region").innerText = data.location.name;
    document.getElementById("currentTemp").innerText = `${data.current.temp_c}°C`;
    document.getElementById("maxTemp").innerText = `${data.forecast.forecastday[0].day.maxtemp_c}°C`;
    document.getElementById("minTemp").innerText = `${data.forecast.forecastday[0].day.mintemp_c}°C`;
    document.getElementById("condition").innerText = data.current.condition.text;
}


//display one day weather hourly
function displayHourlyWeather(data){
    const hourlyData = data.forecast.forecastday[0].hour;
    const container = document.getElementById("day");
    container.innerHTML = "";

    hourlyData.forEach(hour => {
        const time = hour.time.split(" ")[1]; // "06:00"
        const temp = hour.temp_c;
        const condition = hour.condition.text;
        const iconUrl = "https:" + hour.condition.icon;

        const card = document.createElement("div");
        card.className = "hour-card";

        card.innerHTML = `
            <strong>${time}</strong><br>
            <img src="${iconUrl}" width="40"><br>
            ${temp}°C
        `;

        container.appendChild(card);
    });
}

//display one week weather
function displayWeeklyWeather(data){
    const weekList = document.getElementById("week");
    weekList.innerHTML="";
    
    const tz = data.location.tz_id; //ex: "Asia/Shanghai"
    const formatter = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        timeZone: tz,
    });


    data.forecast.forecastday.forEach((day,index) =>{
        const [year, month, dayNum] = day.date.split("-").map(Number);
        const dateObj = new Date(Date.UTC(year, month - 1, dayNum, 12, 0, 0)); 
        
        const weekday = formatter.format(dateObj);
        const dateStr = `${month}/${dayNum}`; // MM/DD

        const label = index === 0
            ? `Today（${dateStr}）`
            : `${weekday}（${dateStr}）`;

        const minTemp = day.day.mintemp_c;
        const maxTemp = day.day.maxtemp_c;
        const iconUrl = "https:" + day.day.condition.icon;

        const row = document.createElement("div");
        row.className = "week-day-row";

        row.innerHTML = `
            <div class="week-day-label">${label}</div>
            <div class="weather-info">
            <img src="${iconUrl}" width="32" height="32" alt="${day.day.condition.text}">
            <span>${minTemp}°C / ${maxTemp}°C</span>
            </div>
        `;

        weekList.appendChild(row);
    });
}







document.querySelector("#searchButton").addEventListener("click", searchCity);
init();