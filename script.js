const API_KEY = 'd11b356a59384ebaa69114158253008';
const cityInput = document.getElementById('city-input');
const suggestionsList = document.getElementById('suggestions');
const weatherDisplay = document.getElementById('weather-display');
const locationEl = document.getElementById('location');
const temperatureEl = document.getElementById('temperature');
const conditionEl = document.getElementById('condition');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('wind-speed');
const feelsLikeEl = document.getElementById('feels-like');
const pressureEl = document.getElementById('pressure');
const weatherIcon = document.getElementById('weather-icon');

let debounceTimer;

cityInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        const query = cityInput.value.trim();
        if (query.length > 2) {
            fetchSuggestions(query);
        } else {
            suggestionsList.style.display = 'none';
        }
    }, 300);
});

suggestionsList.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
        cityInput.value = e.target.textContent;
        suggestionsList.style.display = 'none';
        fetchWeather(cityInput.value);
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        fetchWeather(cityInput.value);
    }
});

async function fetchSuggestions(query) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${encodeURIComponent(query)}`);
        const data = await response.json();
        suggestionsList.innerHTML = '';
        if (data.length > 0) {
            data.forEach(city => {
                const li = document.createElement('li');
                li.textContent = `${city.name}, ${city.region}, ${city.country}`;
                suggestionsList.appendChild(li);
            });
            suggestionsList.style.display = 'block';
        } else {
            suggestionsList.style.display = 'none';
        }
    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
}

async function fetchWeather(city) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}&aqi=no`);
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error('Error fetching weather:', error);
        alert('City not found. Please try again.');
    }
}

function displayWeather(data) {
    locationEl.textContent = `${data.location.name}, ${data.location.country}`;
    temperatureEl.textContent = `${data.current.temp_c}°C`;
    conditionEl.textContent = data.current.condition.text;
    humidityEl.textContent = `${data.current.humidity}%`;
    windSpeedEl.textContent = `${data.current.wind_kph} kph`;
    feelsLikeEl.textContent = `${data.current.feelslike_c}°C`;
    pressureEl.textContent = `${data.current.pressure_mb} mb`;
    weatherIcon.src = `https:${data.current.condition.icon}`;

    document.body.classList.remove('night', 'hot', 'cold');
    if (data.current.is_day === 0) {
        document.body.classList.add('night');
    } else {
        const temp = data.current.temp_c;
        if (temp > 30) {
            document.body.classList.add('hot');
        } else if (temp < 10) {
            document.body.classList.add('cold');
        }
    }

    weatherDisplay.style.display = 'block';
} 