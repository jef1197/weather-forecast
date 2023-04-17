var apiKey = '&appid=623ca1c4df967f2504f330397c76fcb9';

// function to get latitude and longitude of searched city
function searchCity(city) { 
  var search = `http://api.openweathermap.org/geo/1.0/direct?q=${city}${apiKey}`;
  fetch(search)
  .then(function (res) {
    if (!res.ok) {
      throw res.json();
    }
    return res.json();
  })
  .then(function (data) { 
    var lat = data[0].lat;
    var lon = data[0].lon;
    setLocalStorage(lat, lon);
    getWeather(lat, lon);
  })
  .catch (function (err) { 
    console.log('no city found')
  });
}

// function to get weather using lat and lon of selected city
function getWeather( lat, lon ) {  
  renderSearch();
  var search = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric${apiKey}`;
  fetch(search)
  .then(function (res) {
    if (!res.ok) {
      throw res.json();
    }
    return res.json();
  })
  .then(function (data) { 
    // get daily forecast 
    var info = {
      city: data.city.name,
      temp : data.list[0].main.temp,
      wind : data.list[0].wind.speed,
      humidity : data.list[0].main.humidity,
      date : data.list[0].dt_txt,
      condition : `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}.png`
    }
    renderDailyWeather(info);

    // Get Weekly/5-day forecast
    var arr = data.list;
    var timeSearch = "00:00:00"
    // filters array for the start of the next day
    let weeklyWeather = arr.filter(object => object.dt_txt.includes(timeSearch));
    renderWeeklyWeather(weeklyWeather);
  })
  .catch (function (err) { 
    console.log(err)
  });
}

// adds city object to local storage
function setLocalStorage (lat, lon) {  
  var search = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric${apiKey}`;
  fetch(search)
  .then(function (res) {
    if (!res.ok) {
      throw res.json();
    }
    return res.json();
  })
  .then(function (data) { 
    var info = {
      city: data.city.name,
      lat: data.city.coord.lat, 
      lon: data.city.coord.lon,
    }
    var searchHistory = getSearch();
    searchHistory.push(info)
    setSearch(searchHistory);
  })
  .catch (function (err) { 
    console.log(err)
  });
}

// function to render daily information to pageinfo.
function renderDailyWeather (info) { 
  $('#day-city').text(`${info.city} ${info.date}`);
  $('#day-condition').attr("src",info.condition);
  $('#day-temp').text(`Temp: ${info.temp}\xB0C`);
  $('#day-wind').text(`Wind: ${info.wind} KPH`);
  $('#day-humidity').text(`Humidity: ${info.humidity} %`);
}

// function to render weekly cards to page
function renderWeeklyWeather (week) { 
  $('.weekday-container').empty();
  for (var i = 0; i < week.length; i++){ 
    
    var info = {
      temp : week[i].main.temp,
      wind : week[i].wind.speed,
      humidity : week[i].main.humidity,
      date : week[i].dt_txt,
      condition : `https://openweathermap.org/img/wn/${week[i].weather[0].icon}.png`
    }

    var div = $("<div class='day-card'></div>");
    var pDay = $(`<p class='week-date'>${info.date}</p>`);
    var img = $(`<img id="day-condition" src='${info.condition}' alt=""/>  `);
    var pTemp = $(`<p>Temp: ${info.temp}\xB0C</p>`);
    var pWind = $(`<p>Wind: ${info.wind} KPH</p>`);
    var pHumidity = $(`<p>Humidity: ${info.humidity} %</p>`);

    div.append(pDay);
    div.append(img);
    div.append(pTemp);
    div.append(pWind);
    div.append(pHumidity);

    $('.weekday-container').append(div);
  }
}

// renders search history to page
function renderSearch() {
  var recentSearches = getSearch();
  $('.city-container').empty();
  for(var i = 0; i < recentSearches.length; i++) {
    var a = $(`<a class='search-history' data-lat='${recentSearches[i].lat}' data-lon='${recentSearches[i].lon}'>${recentSearches[i].city}</a>`);
    $('.city-container').append(a);
  }
}

// Gets the local storage array
function getSearch() {
  var localSearch = localStorage.getItem('search');
  if(localSearch) {
    localSearch = JSON.parse(localSearch);
  } else {
    localSearch= [];
  }
  return localSearch;
}

// Sets the local storage array 
function setSearch(search) {
  // if more than 20 results in array remove the first element
  if (search.length > 20) {
    search.shift();
    localStorage.setItem('search', JSON.stringify(search));
    return;
  }
  localStorage.setItem('search', JSON.stringify(search));
}

// Handles the the button submit when user searches for city
function handleSubmit(e) {
  e.preventDefault();
  var city =  $('#city-search').val();
  if (!city) {
    console.log('error')
    return;
  }
  searchCity(city);
}

// function to handle search history clicks
function handleClick(e) { 
  var lat = (e.target.dataset.lat)
  var lon = (e.target.dataset.lon)
  getWeather(lat, lon);
}

renderSearch();
// Event Listners for submit button / search history links
$('#submit').on('click', handleSubmit);
$('.city-container').on('click', '.search-history', handleClick)
