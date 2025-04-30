// Le-Cloud Weather App - Main JS functionality
// This uses the Open-Meteo API which doesn't require an API key

// API configuration
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';
const GEO_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const ICON_MAPPING = {
    'clear_day': '01d',
    'clear_night': '01n',
    'partly_cloudy_day': '02d',
    'partly_cloudy_night': '02n',
    'cloudy': '03d',
    'fog': '50d',
    'rain': '10d',
    'showers': '09d',
    'thunderstorm': '11d',
    'snow': '13d'
};
const BASE_ICONS_URL = 'https://openweathermap.org/img/wn';

// DOM elements
const locationInput = document.getElementById('location-input');
const searchBtn = document.getElementById('search-btn');
const geoBtn = document.getElementById('geolocation-btn');
const locationElement = document.getElementById('location');
const dateTimeElement = document.getElementById('date-time');
const temperatureElement = document.getElementById('temperature');
const weatherDescription = document.getElementById('weather-description');
const weatherImg = document.getElementById('weather-img');
const feelsLikeElement = document.getElementById('feels-like');
const humidityElement = document.getElementById('humidity');
const windSpeedElement = document.getElementById('wind-speed');
const cloudinessElement = document.getElementById('cloudiness');
const forecastContainer = document.getElementById('forecast');

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Try to get user's location on page load
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => getWeatherByCoords(position.coords.latitude, position.coords.longitude),
            (error) => {
                console.error("Geolocation error:", error);
                // Default location if geolocation fails
                getWeatherByCity('London');
            }
        );
    } else {
        // Default location if geolocation is not supported
        getWeatherByCity('London');
    }

    // Set up search functionality
    searchBtn.addEventListener('click', () => {
        const city = locationInput.value.trim();
        if (city) {
            getWeatherByCity(city);
        }
    });

    // Allow enter key to trigger search
    locationInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const city = locationInput.value.trim();
            if (city) {
                getWeatherByCity(city);
            }
        }
    });

    // Set up geolocation button
    geoBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => getWeatherByCoords(position.coords.latitude, position.coords.longitude),
                (error) => console.error("Geolocation error:", error)
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    });

    // Update date and time
    updateDateTime();
    setInterval(updateDateTime, 60000); // Update every minute
});

// Get weather by city name
async function getWeatherByCity(city) {
    try {
        console.log(`Getting coordinates for city: ${city}`);
        
        // First, get coordinates using Open-Meteo Geocoding API
        const geoResponse = await fetch(`${GEO_API_URL}?name=${encodeURIComponent(city)}&count=1`);
        
        if (!geoResponse.ok) {
            throw new Error(`Geocoding failed: ${geoResponse.status}`);
        }
        
        const geoData = await geoResponse.json();
        
        if (!geoData.results || geoData.results.length === 0) {
            throw new Error('City not found');
        }
        
        const location = geoData.results[0];
        console.log(`Found location: ${location.name}, ${location.country}`);
        
        // Now get weather using coordinates
        getWeatherByCoords(location.latitude, location.longitude, `${location.name}, ${location.country}`);
        
    } catch (error) {
        console.error("Error fetching city data:", error);
        locationElement.textContent = 'City not found';
    }
}

// Get weather by coordinates
async function getWeatherByCoords(lat, lon, locationName = null) {
    try {
        console.log(`Fetching weather for coordinates: ${lat}, ${lon}`);
        
        // Get weather data from Open-Meteo API
        const weatherURL = `${WEATHER_API_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,cloud_cover&hourly=temperature_2m,weather_code,cloud_cover,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`;
        
        const weatherResponse = await fetch(weatherURL);
        
        if (!weatherResponse.ok) {
            throw new Error(`Weather data not available: ${weatherResponse.status}`);
        }
        
        const weatherData = await weatherResponse.json();
        
        // If locationName wasn't provided, try reverse geocoding
        if (!locationName) {
            try {
                const reverseGeoURL = `${GEO_API_URL}?latitude=${lat}&longitude=${lon}&count=1`;
                const reverseGeoResponse = await fetch(reverseGeoURL);
                
                if (reverseGeoResponse.ok) {
                    const reverseGeoData = await reverseGeoResponse.json();
                    if (reverseGeoData.results && reverseGeoData.results.length > 0) {
                        const location = reverseGeoData.results[0];
                        locationName = `${location.name}, ${location.country}`;
                    }
                }
            } catch (geoError) {
                console.warn("Reverse geocoding failed:", geoError);
                locationName = "Current Location";
            }
        }
        
        // Format data for our UI
        const formattedData = formatWeatherData(weatherData, locationName || "Current Location");
        
        // Log weather condition for debugging
        console.log("Weather condition:", formattedData.weather[0].main, "- Description:", formattedData.weather[0].description);
        
        // Update UI with weather data
        updateWeatherUI(formattedData);
        updateForecastUI(formattedData);
        
        // Update page theme based on weather conditions - explicitly call updateTheme
        updateTheme(formattedData);
        
    } catch (error) {
        console.error("Error fetching weather data:", error);
        locationElement.textContent = 'Weather data unavailable';
    }
}

// Format Open-Meteo data to match our UI expectations
function formatWeatherData(data, locationName) {
    // Convert WMO weather code to condition
    const weatherCode = data.current.weather_code;
    const isDay = isCurrentlyDay(data.daily.sunrise[0], data.daily.sunset[0]);
    
    const weatherCondition = getWeatherCondition(weatherCode);
    const iconCode = getIconCode(weatherCode, isDay);
    
    // Format data structure to match our UI functions
    return {
        name: locationName,
        weather: [{
            id: weatherCode,
            main: weatherCondition,
            description: weatherCondition.toLowerCase(),
            icon: iconCode
        }],
        main: {
            temp: data.current.temperature_2m,
            feels_like: data.current.temperature_2m, // Open-Meteo free tier doesn't provide feels_like
            humidity: data.current.relative_humidity_2m
        },
        wind: {
            speed: data.current.wind_speed_10m,
            deg: data.current.wind_direction_10m
        },
        clouds: {
            all: data.current.cloud_cover
        },
        sys: {
            country: locationName.split(', ')[1] || ''
        },
        forecast: formatForecastData(data)
    };
}

// Format forecast data
function formatForecastData(data) {
    const forecast = [];
    
    for (let i = 0; i < 5; i++) {
        if (i < data.daily.time.length) {
            const date = new Date(data.daily.time[i]);
            const weatherCode = data.daily.weather_code[i];
            const weatherCondition = getWeatherCondition(weatherCode);
            const iconCode = getIconCode(weatherCode, true); // Assume day for forecast icons
            
            forecast.push({
                dt: date.getTime() / 1000,
                weather: [{
                    id: weatherCode,
                    main: weatherCondition,
                    description: weatherCondition.toLowerCase(),
                    icon: iconCode
                }],
                main: {
                    temp: (data.daily.temperature_2m_max[i] + data.daily.temperature_2m_min[i]) / 2
                }
            });
        }
    }
    
    return forecast;
}

// Check if it's currently day or night
function isCurrentlyDay(sunrise, sunset) {
    const now = new Date().getTime();
    const sunriseTime = new Date(sunrise).getTime();
    const sunsetTime = new Date(sunset).getTime();
    
    return now > sunriseTime && now < sunsetTime;
}

// Map WMO weather codes to weather condition strings
function getWeatherCondition(code) {
    // WMO Weather interpretation codes (WW)
    // https://open-meteo.com/en/docs
    if (code === 0) return "Clear";
    if (code === 1) return "Mainly Clear";
    if (code === 2) return "Partly Cloudy";
    if (code === 3) return "Cloudy";
    if (code >= 45 && code <= 48) return "Fog";
    if (code >= 51 && code <= 55) return "Drizzle";
    if (code >= 56 && code <= 57) return "Freezing Drizzle";
    if (code >= 61 && code <= 65) return "Rain";
    if (code >= 66 && code <= 67) return "Freezing Rain";
    if (code >= 71 && code <= 77) return "Snow";
    if (code >= 80 && code <= 82) return "Rain Showers";
    if (code >= 85 && code <= 86) return "Snow Showers";
    if (code >= 95 && code <= 99) return "Thunderstorm";
    return "Unknown";
}

// Map weather conditions to icon codes
function getIconCode(weatherCode, isDay) {
    // Map WMO codes to our icon mapping
    if (weatherCode === 0) return isDay ? '01d' : '01n';
    if (weatherCode === 1) return isDay ? '01d' : '01n';
    if (weatherCode === 2) return isDay ? '02d' : '02n';
    if (weatherCode === 3) return isDay ? '03d' : '03n';
    if (weatherCode >= 45 && weatherCode <= 48) return '50d';
    if (weatherCode >= 51 && weatherCode <= 55) return '09d';
    if (weatherCode >= 56 && weatherCode <= 57) return '09d';
    if (weatherCode >= 61 && weatherCode <= 65) return '10d';
    if (weatherCode >= 66 && weatherCode <= 67) return '10d';
    if (weatherCode >= 71 && weatherCode <= 77) return '13d';
    if (weatherCode >= 80 && weatherCode <= 82) return '09d';
    if (weatherCode >= 85 && weatherCode <= 86) return '13d';
    if (weatherCode >= 95 && weatherCode <= 99) return '11d';
    return isDay ? '01d' : '01n'; // Default
}

// Update the UI with current weather data
function updateWeatherUI(data) {
    locationElement.textContent = data.name;
    temperatureElement.textContent = Math.round(data.main.temp);
    weatherDescription.textContent = data.weather[0].description;
    weatherImg.src = `${BASE_ICONS_URL}/${data.weather[0].icon}@2x.png`;
    feelsLikeElement.textContent = `${Math.round(data.main.feels_like)}°C`;
    humidityElement.textContent = `${data.main.humidity}%`;
    windSpeedElement.textContent = `${data.wind.speed} m/s`;
    cloudinessElement.textContent = `${data.clouds.all}%`;
}

// Update the forecast section of the UI
function updateForecastUI(data) {
    // Clear existing forecast
    forecastContainer.innerHTML = '';
    
    // Use pre-formatted forecast data
    data.forecast.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        
        forecastItem.innerHTML = `
            <div class="day">${day}</div>
            <img src="${BASE_ICONS_URL}/${item.weather[0].icon}.png" alt="${item.weather[0].description}">
            <div class="temp">${Math.round(item.main.temp)}°C</div>
        `;
        
        forecastContainer.appendChild(forecastItem);
    });
}

// Update the date and time display
function updateDateTime() {
    const now = new Date();
    dateTimeElement.textContent = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}