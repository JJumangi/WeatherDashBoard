//Get EL

var serachBtn = document.getElementById("search-btn");
var list = document.getElementById("city-history");
var todayForecast = document.getElementById("current-forecast");
var day1 = document.getElementById("day1");
var day2 = document.getElementById("day2");
var day3 = document.getElementById("day3");
var day4 = document.getElementById("day4");
var day5 = document.getElementById("day5");

//Glo Var
var error1;
var lat;
var lon;
var cityName;
var searchHistory = [];
var apiKey = "6f77c76afbbb611989c9fdded82b043c";
var currentWeatherWind;
var currentWeatherHumidity;

//get entered city, clear city
function getCity() {
  todayForecast.innerHTML = "";
  day1.innerHTML = "";
  day2.innerHTML = "";
  day3.innerHTML = "";
  day4.innerHTML = "";
  day5.innerHTML = "";
  var input = document.getElementById("cityInput");
  cityName = input.value;
  if (error1) {
    error1.innerHTML = "";
  }
  if (cityName.trim().length === 0) {
    error1 = document.createElement("h3");
    error1.textContent = "Enter City Name";
    error1.setAttribute("style", "color:red");
    serachBtn.after(error1);
  } else {
    request();
  }
}


//Get user's LONG and LAT
function request() {
  var requestCity =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    cityName +
    "&limit=1&appid=" +
    apiKey;
  fetch(requestCity).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        if (data.length > 0) {
          lat = data[0].lat;
          lon = data[0].lon;
          appendCityNames(cityName);
          historyButtons();
          getApi();
        }
      });
    }
  });

}//City name, added to local storage
function appendCityNames(cityName) {
  if (searchHistory.indexOf(cityName) === -1) {
    searchHistory.unshift(cityName);
    if (searchHistory.length > 5) {
      searchHistory.pop();
    }
    window.localStorage.setItem(
      "historyStorage",
      JSON.stringify(searchHistory)
    );
  }
}

//local storage
function getHistory() {
  var retriedItems = JSON.parse(window.localStorage.getItem("historyStorage"));
  if (retriedItems !== null) {
    for (var i = 0; i < retriedItems.length; i++) {
      searchHistory.push(retriedItems[i]);
    }
  }
}

//user city history, create buttons
function historyButtons() {
  list.innerHTML = "";
  let cityStorage = JSON.parse(window.localStorage.getItem("historyStorage"));
  for (var i = 0; i < cityStorage.length; i++) {
    var hxEl = document.createElement("button");
    hxEl.classList.add("mystyle");
    hxEl.textContent = cityStorage[i];
    list.append(hxEl);
  }
}

//5 day forecast 

function getApi() {

  var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + '&units=imperial';
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var nameCity = document.createElement("h2");
      nameCity.textContent = cityName;
      todayForecast.append(nameCity);

      for (let i = 0; i < 40; i += 8) {
        const forecastDate = data.list[i].dt_txt;
        getinfo(i, forecastDate);
      }

      getinfo(0, todayForecast);
      getinfo(8, day1);
      getinfo(16, day2);
      getinfo(24, day3);
      getinfo(32, day4);
      getinfo(39, day5);

      function getinfo(i, docEl) {
        let date = document.createElement('p');
        var currentWeatherTemp = document.createElement('p');
        var currentimage = document.createElement('img');
        var currentWeatherWind = document.createElement('p');
        var currentWeatherHumidity = document.createElement('p');

        if (data.list[i].weather[0].main === 'Clouds') {
          currentimage.src = "./images/cloudy.png";
        } else if (data.list[i].weather[0].main === 'Thunderstorms') {
          currentimage.src = "./images/storm.png";
        } else if (data.list[i].weather[0].main === 'Rain') {
          currentimage.src = "./images/heavy-rain.png";
        } else if (data.list[i].weather[0].main === 'Snow') {
          currentimage.src = "./images/snow.png";
        } else if (data.list[i].weather[0].main === 'Clear') {
          currentimage.src = "./images/sun.png";
        }
        date.textContent = dayjs(data.list[i].dt_txt).format("MM/DD/YYYY");
        currentWeatherTemp.textContent = "Temp: " + data.list[i].main.temp + "°F";
        currentWeatherWind.textContent = "Wind Speed: " + data.list[i].wind.speed + "mph";
        currentWeatherHumidity.textContent = "Humidity: " + data.list[i].main.humidity + "%";

        day1.append(date, currentimage, currentWeatherTemp, currentWeatherWind, currentWeatherHumidity);
      }
    }
    )
};

// Get city name from search history
function searchHx(event) {
  cityName = event.srcElement.innerText;
  if (searchHistory.includes(cityName))
    requestAgain();
}

// Search for city again
function requestAgain() {
  todayForecast.innerHTML = "";
  day1.innerHTML = "";
  day2.innerHTML = "";
  day3.innerHTML = "";
  day4.innerHTML = "";
  day5.innerHTML = "";
  var requestCity =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    cityName +
    "&limit=1&appid=" +
    apiKey;
  fetch(requestCity).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        if (data.length > 0) {
          lat = data[0].lat;
          lon = data[0].lon;
          getApi();
        }
      });
    }
  });
}

// event listeners
serachBtn.addEventListener("click", getCity);
list.addEventListener("click", searchHx);
window.addEventListener("load", function () {
  getHistory();
  historyButtons();
});



