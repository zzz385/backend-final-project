const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Нет доступа (токен не найден)" });

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(403).json({ message: "Пользователь не найден" });
        }

        req.user = { userId: user._id, username: user.username };
        next();
    } catch (error) {
        res.status(403).json({ message: "Неверный токен" });
    }
};
