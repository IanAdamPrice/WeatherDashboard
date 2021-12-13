var key = "ebc02eadda78f9202e08362136389631";
var date = moment().format("dddd, MMMM Do YYYY");
var city = "Charlotte"
var fiveDayEl = $(".fiveDay");
var historyEl = $(".cityHistory");
var todaysWeatherBody = $(".card-body");
var cityHistory = [];

function getHistory() {
	historyEl.empty();

	for (let i = 0; i < cityHistory.length; i++) {

		var rowEl = $("<row>")
            .addClass("row");
		var btnEl = $("<button>").text(`${cityHistory[i]}`)
            .addClass("btn historyBtn w-100 bg-white text-dark")
            .attr("type", "button");

		historyEl.prepend(rowEl);
		rowEl.append(btnEl);
	} if (!city) {
		return;
	}
	$(".historyBtn").on("click", function (event) {
		event.preventDefault();
		city = $(this).text();
		fiveDayEl.empty();
		getCurrentWeather();
	});
};


function getCurrentWeather() {
	var getUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`;

	$(todaysWeatherBody).empty();

	$.ajax({
		url: getUrlCurrent,
		method: "GET",
	}).then(function (response) {
		$(".cardTodayCityName")
            .text(response.name + ": " + date);
		$(".icons")
            .attr("src", `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);
		
		var pEl = $("<p>")
            .text(`Temperature: ${response.main.temp} °F`);
		var humidityEl = $("<p>")
            .text(`Humidity: ${response.main.humidity} %`);
		var pElWind = $("<p>")
            .text(`Wind Speed: ${response.wind.speed} MPH`);
		
        todaysWeatherBody.append(pEl, humidityEl, pElWind);
	});
	getFiveDayForecast();
};


function getFiveDayForecast() {
	var getUrlFiveDay = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${key}`;

	$.ajax({
		url: getUrlFiveDay,
		method: "GET",
	}).then(function (response) {
		var fiveDayArray = response.list;
		var weather = [];
		$.each(fiveDayArray, function (index, value) {
			foreCast = {
				date: value.dt_txt.split(" ")[0],
				temp: value.main.temp,
				wind_speed: value.wind.speed,
				icon: value.weather[0].icon,
				humidity: value.main.humidity
			};

			if (value.dt_txt.split(" ")[1] === "12:00:00") {
				weather.push(foreCast);
			};
		});
		for (let i = 0; i < weather.length; i++) {
            var m = moment(`${weather[i].date}`).format("MM-DD-YYYY");
			var divElCard = $("<div>")
			    .addClass("card text-white bg-primary mb-3 cardOne d-inline-block text-nowrap");
		
			var headerEl = $("<div>")
			    .addClass("card-header")
                .text(m);
			var bodyEl = $("<div>")
			    .addClass("card-body");
			var iconEl = $("<img>")
			    .addClass("icons")
			    .attr("src", `https://openweathermap.org/img/wn/${weather[i].icon}@2x.png`);
			var tempEl = $("<p>")
                .text(`Temperature: ${weather[i].temp} °F`);
			var windSpeedEl = $("<p>")
                .text(`Wind Speed: ${weather[i].wind_speed} MPH`);
			var humidityEl = $("<p>")
                .text(`Humidity: ${weather[i].humidity} %`);
			
			divElCard.append(headerEl,bodyEl);
            bodyEl.append(iconEl, tempEl, windSpeedEl, humidityEl);
            fiveDayEl.append(divElCard);
		};
	});
};


function initLoad() {

	var cityHistoryStore = JSON.parse(localStorage.getItem("city"));

	if (cityHistoryStore !== null) {
		cityHistory = cityHistoryStore
	}
	getHistory();
	getCurrentWeather();
};

$(".search").on("click", function (event) {
	event.preventDefault();
	city = $(this).parent(".searchBtn").siblings(".textVal").val().trim();
	if (city === "") {
		return;
	};
	cityHistory.push(city);
	localStorage.setItem("city", JSON.stringify(cityHistory));
	fiveDayEl.empty();
	getHistory();
	getCurrentWeather();
});

$(".clear").on("click", function(event) {
    event.preventDefault();
    localStorage.clear();
    location.reload();
});

initLoad();