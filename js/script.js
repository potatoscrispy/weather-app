const searchValue = document.getElementById("findinput");
const baseUrl = "https://api.weatherapi.com/v1";
const api_key = "f1dad7a0fdbd4eb5809133507242406";
const currentCard = document.getElementById("current");
const secondCard = document.getElementById("secondCard");
const thirdCard = document.getElementById("thirdCard");
const compass = document.getElementById("compass");
const main = document.getElementById("myData");

findinput.addEventListener("input", async function (e) {
  let hamada = e.target.value;
  if (/^[a-zA-Z]{3,}$/.test(hamada)) {
    await searchCity(hamada);
  }
});

async function searchCity(hamada) {
  let res = await fetch(baseUrl + "/search.json?key=" + api_key + "&q=" + hamada);
  let final = await res.json();
  if (final.length > 0) {
    await dispalyDays(final[0].name);
  }
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(displayCurrentLocation, function (result) {
    alert(result);
  });
}

async function displayCurrentLocation(pos) {
  let res = await fetch(baseUrl + "/current.json?key=" + api_key + "&q=" + pos.coords.latitude + "," + pos.coords.longitude);
  let final = await res.json();
  await dispalyDays(final.location.name);
}

async function dispalyDays(city = "cairo") {
  let res = await fetch(baseUrl + "/forecast.json?key=" + api_key + "&q=" + city + "&days=3");
  let final = await res.json();
  let data = final.forecast.forecastday;
  let windState = getWindDir(final.current.wind_dir);

  main.innerHTML = "";
  for (const day of data) {
    const date = new Date(day.date);
    const weekDay = date.toLocaleDateString("en-US", { weekday: "long" });
    const monthDay = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (data.indexOf(day) === 0) {
      main.innerHTML += `
      
      <div class="card col-lg-4">
        <div class="card-header d-flex justify-content-between bg-color1">
          <div id="day">${weekDay}</div>
          <div id="date">${monthDay}</div>
        </div>
        <div class="card-body bg-color2">
          <div id="city" class="font-3">${final.location.name}</div>
          <div class="d-flex flex-lg-column flex-row">
            <h2 id="degree" class="color4 fs-lg fw-bold my-3">${final.current.temp_c}&deg;C 
            </h2>
            <span id="daynight"
            class="fs-1 ms-4 align-self-end align-self-lg-auto"><img src="${final.current.condition.icon}"></span>
        </div>
          <div id="state" class="color1 fw-bold mb-3">${final.current.condition.text}</div>
          <div class="row row-cols-auto gx-4">
              <div id="humidity">
                  <i class="color4 fs-5 fa fa-umbrella"></i>
                  <span class="ms-1 color3 fw-bold d-inline-block align-middle"> ${final.current.humidity}%</span>
              </div>
              <div id="wind">
                  <i class="color4 fs-5 fa fa-wind"></i>
                  <span class="ms-1 color3 fw-bold d-inline-block align-middle"> ${final.current.wind_kph}km/h</span>
              </div>
              <div id="direction">
                  <i class="color4 fs-5 fa fa-compass"               style="transform: rotate(${windState.angle - 45}deg)"></i>
                  <span class="ms-1 color3 fw-bold d-inline-block align-middle"> ${windState.wind}</span>
              </div>
          </div>
        </div>
      </div>
      `;
    } else {
      main.innerHTML += `
      <div class="card col-lg-4">
          <div class="card-header ${data.indexOf(day) === 1 ? "bg-color2" : "bg-color1"} text-center">
          <div id="nextday">${weekDay}</div>
        </div>
        <div class="card-body ${data.indexOf(day) === 1 ? "bg-color1" : "bg-color2"} text-center">
          <div class="my-4">
          <span><img src="${day.day.condition.icon}"></span>
          </div>
          <h3 id="nextdegree" class="color4 fw-bold">${day.hour[8].temp_c}&deg;C
          </h3>
          <h4 id="nextdegree2" class="color4 fs-s">${day.hour[20].temp_c}&deg;C
          </h4>
          <div id="nextstate" class=" ${data.indexOf(day) === 1 ? "color2" : "color1"} fw-bold mb-3">${day.day.condition.text}</div>
        </div>
      </div>
  
  `;
    }
  }
}

function getWindDir(windDir) {
  let windState = {
    angle: 0,
    wind: "",
  };
  switch (windDir) {
    case "N":
      windState.angle = 0;
      windState.wind = "North";
      break;
    case "NNE":
      windState.angle = 30;
      windState.wind = "North-northeast";
      break;
    case "NE":
      windState.angle = 45;
      windState.wind = "North East";
      break;
    case "ENE":
      windState.angle = 60;
      windState.wind = "East-northeast";
      break;
    case "E":
      windState.angle = 90;
      windState.wind = "East";
      break;
    case "ESE":
      windState.angle = 120;
      windState.wind = "East-southeast";
      break;
    case "SE":
      windState.angle = 135;
      windState.wind = "South East";
      break;
    case "SSE":
      windState.angle = 150;
      windState.wind = "South-southeast";
      break;
    case "S":
      windState.angle = 180;
      windState.wind = "South";
      break;
    case "SSW":
      windState.angle = 210;
      windState.wind = "South-southwest";
      break;
    case "SW":
      windState.angle = 225;
      windState.wind = "South West";
      break;
    case "WSW":
      windState.angle = 240;
      windState.wind = "West-southwest";
      break;
    case "W":
      windState.angle = 270;
      windState.wind = "West";
      break;
    case "WNW":
      windState.angle = 300;
      windState.wind = "West-northwest";
      break;
    case "NW":
      windState.angle = 315;
      windState.wind = "North West";
      break;
    case "NNW":
      windState.angle = 330;
      windState.wind = "North-northwest";
      break;
    default:
      wind = "-";
      break;
  }

  return windState;
}
