function calculateBMI() {
    const weight = parseFloat(document.getElementById("weight").value);
    let height = parseFloat(document.getElementById("height").value);
    
    if (!weight || !height || weight <= 0 || height <= 0) {
        document.getElementById("bmiResult").innerHTML = "<p class='error'>Введите корректные значения!</p>";
        return;
    }

    // 📌 Если рост в сантиметрах, переводим в метры
    if (height > 3) {
        height = height / 100;
    }

    const bmi = weight / (height * height);
    let category = "";

    if (bmi < 18.5) category = "Недостаточный вес 🟡";
    else if (bmi < 24.9) category = "Норма ✅";
    else if (bmi < 29.9) category = "Избыточный вес 🟠";
    else category = "Ожирение 🔴";

    document.getElementById("bmiResult").innerHTML = `
        <p>Ваш ИМТ: <strong>${bmi.toFixed(2)}</strong></p>
        <p>Категория: <strong>${category}</strong></p>
    `;
}
