const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB подключен"))
  .catch(err => console.error("❌ Ошибка подключения:", err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(express.static("public")); 
app.use(express.static("views")); 

app.use("/auth", require("./routes/auth"));
app.use("/bmi", require("./routes/bmi"));
app.use("/nodemailer", require("./routes/nodemailer"));
app.use("/weather", require("./routes/weather"));
app.use("/blog", require("./routes/blog"));
app.use("/qrcode", require("./routes/qrcode"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});
