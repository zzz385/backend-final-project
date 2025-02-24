const express = require("express");
const QRCode = require("qrcode");
const router = express.Router();

router.get("/", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "Введите ссылку!" });

    try {
        const qrCode = await QRCode.toDataURL(url);
        res.setHeader("Content-Type", "application/json");
        res.json({ qrCode });
    } catch (error) {
        console.error("❌ Ошибка при генерации QR-кода:", error);
        res.status(500).json({ error: "Ошибка при генерации QR-кода" });
    }
});

module.exports = router;
