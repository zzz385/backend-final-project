let map;

async function getWeather() {
    const city = document.getElementById("city").value;
    if (!city) {
        document.getElementById("weatherResult").innerHTML = "<p class='error'>Введите название города!</p>";
        return;
    }

    const res = await fetch(`/weather?city=${city}`);
    const data = await res.json();

    if (data.error) {
        document.getElementById("weatherResult").innerHTML = `<p class='error'>Ошибка: ${data.error}</p>`;
        return;
    }

    document.getElementById("weatherResult").innerHTML = `
        <p>Температура: <strong>${data.temperature}°C</strong></p>
        <p>Влажность: <strong>${data.humidity}%</strong></p>
        <p>Ощущается как: <strong>${data.feels_like}°C</strong></p>
        <p>Давление: <strong>${data.pressure} hPa</strong></p>
    `;

    if (data.coord) {
        updateMap(data.coord.lat, data.coord.lon);
    }
}

async function getForecast() {
    const city = document.getElementById("city").value;
    if (!city) {
        document.getElementById("forecastResult").innerHTML = "<p class='error'>Введите название города!</p>";
        return;
    }

    const res = await fetch(`/weather/forecast?city=${city}`);
    const data = await res.json();

    let forecastHtml = `<h3>Прогноз на 3 дня для ${city}:</h3>`;
    data.forecast.forEach(day => {
        forecastHtml += `<p>${day.date}: ${day.condition}, средняя температура: ${day.avg_temp}°C</p>`;
    });

    document.getElementById("forecastResult").innerHTML = forecastHtml;
}

async function getAirQuality() {
    const city = document.getElementById("city").value;
    if (!city) {
        document.getElementById("airQualityResult").innerHTML = "<p class='error'>Введите название города!</p>";
        return;
    }

    const res = await fetch(`/weather/airquality?city=${city}`);
    const data = await res.json();

    if (data.error) {
        document.getElementById("airQualityResult").innerHTML = `<p class='error'>Ошибка: ${data.error}</p>`;
        return;
    }

    document.getElementById("airQualityResult").innerHTML = `
        <h3>Качество воздуха в ${data.city}:</h3>
        <ul>
            <li><strong>PM10:</strong> ${data.air_quality.pm10} µg/m³</li>
            <li><strong>PM2.5:</strong> ${data.air_quality.pm2_5} µg/m³</li>
            <li><strong>CO (Углеродный оксид):</strong> ${data.air_quality.co} ppm</li>
            <li><strong>NO2 (Диоксид азота):</strong> ${data.air_quality.no2} ppb</li>
            <li><strong>SO2 (Диоксид серы):</strong> ${data.air_quality.so2} ppb</li>
            <li><strong>O3 (Озон):</strong> ${data.air_quality.o3} ppb</li>
        </ul>
    `;
}

function updateMap(lat, lon) {
    if (!map) {
        map = L.map('map').setView([lat, lon], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
    } else {
        map.setView([lat, lon], 10);
    }

    if (map.marker) {
        map.removeLayer(map.marker);
    }

    map.marker = L.marker([lat, lon]).addTo(map)
        .bindPopup("Расположение города")
        .openPopup();
}
