// Le-Cloud Weather App - Theme handling
// This file handles the dynamic theming based on weather conditions

// Function to update the theme based on weather data
function updateTheme(weatherData) {
    // Get the main weather condition and icon code
    const weatherCondition = weatherData.weather[0].main.toLowerCase();
    const iconCode = weatherData.weather[0].icon;
    
    // Determine if it's day or night from the icon code (last character is 'd' for day, 'n' for night)
    const isDay = iconCode.endsWith('d');
    
    console.log(`Applying theme for weather condition: ${weatherCondition}, isDay: ${isDay}`);
    
    // Remove all previous theme classes
    document.body.classList.remove(
        'clear-day', 'clear-night', 'clouds', 
        'rain', 'thunderstorm', 'snow', 'mist'
    );
    
    // Apply the appropriate theme class based on weather conditions
    if (weatherCondition === 'clear' || weatherCondition === 'mainly clear') {
        document.body.classList.add(isDay ? 'clear-day' : 'clear-night');
    } else if (weatherCondition === 'clouds' || weatherCondition === 'cloudy' || weatherCondition === 'partly cloudy') {
        document.body.classList.add('clouds');
    } else if (weatherCondition === 'rain' || weatherCondition === 'drizzle' || 
               weatherCondition === 'rain showers' || weatherCondition === 'freezing rain') {
        document.body.classList.add('rain');
    } else if (weatherCondition === 'thunderstorm') {
        document.body.classList.add('thunderstorm');
    } else if (weatherCondition === 'snow' || weatherCondition === 'snow showers' || 
               weatherCondition === 'freezing drizzle') {
        document.body.classList.add('snow');
    } else if (weatherCondition === 'mist' || weatherCondition === 'fog' || 
              weatherCondition === 'haze' || weatherCondition === 'smoke') {
        document.body.classList.add('mist');
    } else {
        // Default theme if no condition matches
        document.body.classList.add(isDay ? 'clear-day' : 'clear-night');
    }
    
    // Update favicon based on weather
    updateFavicon(iconCode);
    
    // Add some dynamic visual effects based on weather
    addWeatherEffects(weatherCondition, isDay);
}

// Update favicon based on weather icon
function updateFavicon(iconCode) {
    const favicon = document.querySelector('link[rel="icon"]') || 
                    document.createElement('link');
    
    favicon.type = 'image/png';
    favicon.rel = 'icon';
    favicon.href = `https://openweathermap.org/img/wn/${iconCode}.png`;
    
    if (!document.querySelector('link[rel="icon"]')) {
        document.head.appendChild(favicon);
    }
}

// Add visual effects based on weather (could be expanded with more elaborate effects)
function addWeatherEffects(weatherCondition, isDay) {
    // Remove any existing weather effect containers
    const existingEffects = document.querySelector('.weather-effects');
    if (existingEffects) {
        existingEffects.remove();
    }
    
    // Create weather effect container
    const effectsContainer = document.createElement('div');
    effectsContainer.className = 'weather-effects';
    effectsContainer.style.position = 'fixed';
    effectsContainer.style.top = '0';
    effectsContainer.style.left = '0';
    effectsContainer.style.width = '100%';
    effectsContainer.style.height = '100%';
    effectsContainer.style.pointerEvents = 'none';
    effectsContainer.style.zIndex = '-1';
    effectsContainer.style.overflow = 'hidden';
    
    // Apply different effects based on weather
    if (weatherCondition === 'rain' || weatherCondition === 'drizzle' || 
        weatherCondition === 'rain showers' || weatherCondition === 'freezing rain') {
        createRainEffect(effectsContainer);
    } else if (weatherCondition === 'snow' || weatherCondition === 'snow showers' || 
               weatherCondition === 'freezing drizzle') {
        createSnowEffect(effectsContainer);
    } else if (weatherCondition === 'thunderstorm') {
        createThunderstormEffect(effectsContainer);
    }
    
    // Add to document
    document.body.appendChild(effectsContainer);
}

// Rain effect
function createRainEffect(container) {
    for (let i = 0; i < 100; i++) {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.style.position = 'absolute';
        drop.style.width = '2px';
        drop.style.height = `${Math.random() * 20 + 10}px`;
        drop.style.backgroundColor = 'rgba(174, 194, 224, 0.5)';
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.top = `${Math.random() * 100}%`;
        drop.style.animationDuration = `${Math.random() * 1 + 0.5}s`;
        drop.style.animationName = 'rain-fall';
        drop.style.animationIterationCount = 'infinite';
        drop.style.animationTimingFunction = 'linear';
        
        container.appendChild(drop);
    }
    
    // Add CSS animation for rain
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes rain-fall {
            from { transform: translateY(-100px); }
            to { transform: translateY(calc(100vh + 100px)); }
        }
    `;
    document.head.appendChild(styleSheet);
}

// Snow effect
function createSnowEffect(container) {
    for (let i = 0; i < 50; i++) {
        const flake = document.createElement('div');
        flake.className = 'snow-flake';
        flake.style.position = 'absolute';
        flake.style.width = `${Math.random() * 5 + 2}px`;
        flake.style.height = flake.style.width;
        flake.style.backgroundColor = 'white';
        flake.style.borderRadius = '50%';
        flake.style.opacity = '0.8';
        flake.style.left = `${Math.random() * 100}%`;
        flake.style.top = `${Math.random() * 100}%`;
        flake.style.animationDuration = `${Math.random() * 5 + 3}s`;
        flake.style.animationName = 'snow-fall';
        flake.style.animationIterationCount = 'infinite';
        flake.style.animationTimingFunction = 'linear';
        
        container.appendChild(flake);
    }
    
    // Add CSS animation for snow
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes snow-fall {
            from {
                transform: translateY(-10px) rotate(0deg);
            }
            to {
                transform: translateY(calc(100vh + 10px)) rotate(360deg);
            }
        }
    `;
    document.head.appendChild(styleSheet);
}

// Thunderstorm effect
function createThunderstormEffect(container) {
    // Create rain effect first
    createRainEffect(container);
    
    // Add lightning flash effect
    const lightning = document.createElement('div');
    lightning.style.position = 'fixed';
    lightning.style.top = '0';
    lightning.style.left = '0';
    lightning.style.width = '100%';
    lightning.style.height = '100%';
    lightning.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    lightning.style.opacity = '0';
    lightning.style.pointerEvents = 'none';
    lightning.style.zIndex = '1000';
    
    container.appendChild(lightning);
    
    // Flash lightning occasionally
    setInterval(() => {
        if (Math.random() < 0.3) {
            lightning.style.opacity = '1';
            
            setTimeout(() => {
                lightning.style.opacity = '0';
                
                setTimeout(() => {
                    if (Math.random() < 0.5) {
                        lightning.style.opacity = '0.6';
                        setTimeout(() => {
                            lightning.style.opacity = '0';
                        }, 80);
                    }
                }, 100);
            }, 150);
        }
    }, 5000);
}