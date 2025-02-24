const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
    try {
        const { weight, height } = req.body;
        if (!weight || !height) {
            return res.status(400).json({ message: "Введите вес и рост" });
        }

        const heightInMeters = height > 3 ? height / 100 : height;

        const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);
        let category = "";

        if (bmi < 18.5) category = "Недостаточный вес";
        else if (bmi < 24.9) category = "Норма";
        else if (bmi < 29.9) category = "Избыточный вес";
        else category = "Ожирение";

        res.json({ bmi, category });
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

router.get("/", (req, res) => {
    res.json({ message: "BMI API работает! Используйте POST /bmi" });
});

module.exports = router;

