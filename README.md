# Le-Cloud Weather Application

A dynamic weather web application that displays current weather and forecast data with themes that change based on current weather conditions.

## Features

- **Current Weather Display**: Shows temperature, location, and other detailed weather information
- **5-Day Forecast**: Displays weather forecast for the next 5 days
- **Geolocation Support**: Automatically detects user's location for weather data
- **Custom Location Search**: Allows users to search for weather in any location
- **Dynamic Theming**: Application theme changes based on:
  - Current weather conditions (sunny, cloudy, rain, snow, etc.)
  - Time of day (day/night)
- **Weather Effects**: Visual effects like rain, snow, and lightning animations
- **Responsive Design**: Works on mobile, tablet, and desktop devices
- **No API Key Required**: Uses free public APIs without authentication

## Setup Instructions

### Prerequisites

- Docker (for containerization)
- Kubernetes cluster (for deployment)

### Local Development

To run the application locally:

1. Clone this repository
2. Open `index.html` in your web browser

### Docker Build and Run

Build the Docker image:
```bash
docker build -t keanuwatts/theclusterflux:le-cloud .
```

Run the container:
```bash
docker run -p 8080:8080 keanuwatts/theclusterflux:le-cloud
```

The application will be available at http://localhost:8080

### Kubernetes Deployment

The application is already configured to deploy to Kubernetes using the provided `deployment.yaml` file.

Deploy to your Kubernetes cluster:
```bash
kubectl apply -f deployment.yaml
```

## Technical Details

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Weather API**: Open-Meteo API (free, no authentication required)
- **Geocoding**: Open-Meteo Geocoding API
- **Container**: Nginx Alpine-based Docker image
- **Deployment**: Kubernetes with Nginx Ingress
- **Port**: Configured to run on port 8080 to match K8s configuration

## Project Structure

```
le-cloud/
├── index.html          # Main HTML file
├── Dockerfile          # Docker configuration
├── deployment.yaml     # Kubernetes deployment configuration
├── styles/
│   └── main.css        # CSS styles including weather themes
├── scripts/
│   ├── main.js         # Core weather functionality
│   └── theme.js        # Dynamic theme handling
└── public/             # Static assets directory
```

## Weather Themes

The application dynamically changes its appearance based on current weather conditions:

- **Clear Day**: Bright, sunny theme with yellow/orange accents
- **Clear Night**: Dark blue theme optimized for nighttime
- **Cloudy**: Gray/blue subtle theme
- **Rain**: Blue theme with rain animation effects
- **Thunderstorm**: Purple theme with lightning flash effects
- **Snow**: Light blue/white theme with snow animation
- **Mist/Fog**: Gray theme with reduced visibility effects

## License

This project is open source and available for use, modification, and distribution.