const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

// 📌 Настройки почты (Gmail SMTP)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // 📌 Должно быть в .env
        pass: process.env.EMAIL_PASS  // 📌 Должно быть в .env
    }
});

// 📌 Отправка письма
router.post("/", async (req, res) => {
    try {
        const { to, subject, message } = req.body;
        if (!to || !subject || !message) {
            return res.status(400).json({ message: "Введите все поля!" });
        }

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            html: `<p>${message}</p>` // 📌 Можно отправлять HTML
        });

        res.json({ message: "Письмо отправлено!" });
    } catch (error) {
        console.error("❌ Ошибка отправки письма:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

module.exports = router;
