const express = require("express");
const axios = require("axios");
const router = express.Router();

// 📌 Текущая погода
router.get("/", async (req, res) => {
    const { city } = req.query;
    if (!city) return res.status(400).json({ error: "Введите название города!" });

    try {
        const response = await axios.get(`https://wttr.in/${city}?format=j1`);
        const data = response.data;

        res.json({
            temperature: data.current_condition[0].temp_C,
            humidity: data.current_condition[0].humidity,
            feels_like: data.current_condition[0].FeelsLikeC,
            pressure: data.current_condition[0].pressure,
            coord: {
                lat: data.nearest_area[0].latitude,
                lon: data.nearest_area[0].longitude
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Ошибка при получении данных о погоде" });
    }
});

// 📌 Прогноз погоды на 3 дня
router.get("/forecast", async (req, res) => {
    const { city } = req.query;
    if (!city) return res.status(400).json({ error: "Введите название города!" });

    try {
        const response = await axios.get(`https://wttr.in/${city}?format=j1`);
        const forecast = response.data.weather.slice(0, 3).map(day => ({
            date: day.date,
            avg_temp: day.avgtempC,
            condition: day.hourly[4].weatherDesc[0].value
        }));

        res.json({ forecast });
    } catch (error) {
        res.status(500).json({ error: "Ошибка при получении прогноза погоды" });
    }
});

// 📌 Получение координат города (для карты)
async function getCoordinates(city) {
    try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${city}&format=json&limit=1`);
        if (response.data.length > 0) {
            return {
                lat: response.data[0].lat,
                lon: response.data[0].lon
            };
        }
        return null;
    } catch (error) {
        return null;
    }
}

// 📌 Качество воздуха
router.get("/airquality", async (req, res) => {
    const { city } = req.query;
    if (!city) return res.status(400).json({ error: "Введите название города!" });

    try {
        const coords = await getCoordinates(city);
        if (!coords) return res.status(404).json({ error: "Город не найден" });

        const response = await axios.get(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${coords.lat}&longitude=${coords.lon}&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&timezone=auto`);
        res.json({
            city: city,
            air_quality: {
                pm10: response.data.hourly.pm10[0],
                pm2_5: response.data.hourly.pm2_5[0],
                co: response.data.hourly.carbon_monoxide[0],
                no2: response.data.hourly.nitrogen_dioxide[0],
                so2: response.data.hourly.sulphur_dioxide[0],
                o3: response.data.hourly.ozone[0]
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Ошибка при получении данных о качестве воздуха" });
    }
});

module.exports = router;
