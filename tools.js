export async function getCurrentWeather({ location }) {
  try {
    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${location}`
    );

    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      return JSON.stringify({
        error: "Location not found",
      });
    }

    const place = geoData.results[0];

    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current_weather=true`
    );

    const weatherData = await weatherResponse.json();

    const weather = weatherData.current_weather;

    return JSON.stringify({
      city: place.name,
      country: place.country,
      temperature: `${weather.temperature}°C`,
      windspeed: `${weather.windspeed} km/h`,
      condition: getWeatherDescription(weather.weathercode),
      day: weather.is_day ? "Day" : "Night",
    });
  } catch (err) {
    console.error(err);

    return JSON.stringify({
      error: "Unable to fetch weather",
    });
  }
}

function getWeatherDescription(code) {
  const weatherCodes = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    61: "Rain",
    80: "Rain showers",
    95: "Thunderstorm",
  };

  return weatherCodes[code] || "Unknown weather";
}

export const functions = [
  {
    function: getCurrentWeather,

    parse: JSON.parse,

    parameters: {
      type: "object",

      properties: {
        location: {
          type: "string",
          description: "City name to get weather for",
        },
      },

      required: ["location"],
    },
  },
];