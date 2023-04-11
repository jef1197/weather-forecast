var apiKey = '&appid=623ca1c4df967f2504f330397c76fcb9';
var citySearch = $('#city-search');

function handleSubmit(e) {
  e.preventDefault();
  var city = citySearch.val();
  if (!city) {
    console.log('error')
    return;
  }
  searchCity(city);
}

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
    getWeather(lat,lon);
  })
  .catch (function (err) { 
    console.log('no city found')
  });
}

function getWeather( lat, lon ) {  
  var search = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial${apiKey}`;
  fetch(search)
  .then(function (res) {
    if (!res.ok) {
      throw res.json();
    }
    return res.json();
  })
  .then(function (data) { 

    // get daily forecast 
    var city = data.city.name;
    var temp = data.list[0].main.temp;
    var wind = data.list[0].wind.speed;
    var humidity = data.list[0].main.humidity;
    renderDailyWeather(city,temp,wind,humidity);

    // Get Weekly forecast
    var arr = data.list;
    var timeSearch = "00:00:00"
    // filters array for the start of the next day
    let weeklyWeather = arr.filter(o => o.dt_txt.includes(timeSearch));
    renderWeeklyWeather(weeklyWeather);
  })
  .catch (function (err) { 
    console.log(err)
  });

}

function renderDailyWeather (city, temp, wind, humidity) { 
  console.log('render day weather')
  // add data to element
}

function renderWeeklyWeather (week) { 
  console.log('render week weather')
  // for loop on array
  // create card for each element in array
  // add data from array to elements
  // append elemnt to page
}

$('#submit').on('click', handleSubmit);