async function sendEmail() {
    const to = document.getElementById("to").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;

    if (!to || !subject || !message) {
        document.getElementById("mailResult").innerHTML = "<p class='error'>Введите все поля!</p>";
        return;
    }

    try {
        const res = await fetch("/nodemailer", { // 📌 Отправляем запрос на сервер
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ to, subject, message })
        });

        const data = await res.json();
        if (res.ok) {
            document.getElementById("mailResult").innerHTML = "<p class='success'>Письмо отправлено! ✅</p>";
        } else {
            document.getElementById("mailResult").innerHTML = `<p class='error'>Ошибка: ${data.message}</p>`;
        }
    } catch (error) {
        document.getElementById("mailResult").innerHTML = "<p class='error'>Ошибка сервера</p>";
    }
}
