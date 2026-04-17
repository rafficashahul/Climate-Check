// 1. Get DOM elements
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherContainer = document.getElementById("weatherContainer");

// 2. Fetch coordinates from city name
const getCoordinates = async (city) => {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${city}`,
  );
  const data = await response.json();
  console.log(data);
  return data.results ? data.results[0] : null;
};

// 3. Fetch weather data
const getWeather = async (lat, lon) => {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,weathercode&timezone=auto`,
  );
  const data = await response.json();
  console.log(data.daily.weathercode);
  return data.daily;
};
const getWeatherIcon = (code) => {
  if (code === 0) return "☀️";
  if (code <= 3) return "🌤️";
  if (code <= 48) return "🌫️";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "❄️";
  if (code <= 82) return "🌦️";
  return "⛈️";
};

// 4. Display card
const displayCard = (date, temp, code) => {
  const card = document.createElement("div");
  card.classList.add("card");
  const icon = getWeatherIcon(code);
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const dateCard = document.createElement("div");
  const tempCard = document.createElement("div");
  const iconCard = document.createElement("div");
  dateCard.textContent = `${formattedDate}`;
  tempCard.textContent = `${temp}°C`;
  iconCard.textContent = `${icon}`;

  card.append(dateCard, tempCard, iconCard);
  weatherContainer.appendChild(card);
};

// 5. Button click event
searchBtn.addEventListener("click", async () => {
  const city = cityInput.value;

  const location = await getCoordinates(city);

  if (!location) {
    alert("City not found!");
    return;
  }
  const cityName = document.createElement("div");
  cityName.textContent = location.name;
  const weather = await getWeather(location.latitude, location.longitude);

  weatherContainer.innerHTML = ""; // clear old results

  weatherContainer.appendChild(cityName);
  cityName.classList.add("city-name");
  weather.time.forEach((date, index) => {
    const temp = weather.temperature_2m_max[index];
    const code = weather.weathercode[index];
    console.log(`DATE: ${date} | TEMP: ${temp} | CODE: ${code}`);
    displayCard(date, temp, code);
  });
});

// city → getCoordinates → lat/lon → getWeather → daily weather data
// step 1 -  Get DOM elements
// Step 2 - getCoordinates()  →  get lat/lon from city name
// Step 3 - getWeather()      →  get weather data using lat/lon
// Step 4 - displayCard()     →  show the data on screen
// Step 5 - Event Handler     →  ties everything together on button click
