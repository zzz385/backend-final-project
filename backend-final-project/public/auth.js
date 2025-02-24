document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");

    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            if (password.length < 6) {
                document.getElementById("registerMessage").innerHTML = "<p class='error'>Пароль должен быть минимум 6 символов!</p>";
                return;
            }

            const res = await fetch("/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();
            if (res.ok) {
                document.getElementById("registerMessage").innerHTML = "<p class='success'>Регистрация успешна! ✅</p>";
                setTimeout(() => window.location.href = "/login.html", 2000);
            } else {
                document.getElementById("registerMessage").innerHTML = `<p class='error'>Ошибка: ${data.message}</p>`;
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            const res = await fetch("/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("username", username);
                document.getElementById("loginMessage").innerHTML = "<p class='success'>Вход успешен! ✅</p>";
                setTimeout(() => window.location.href = "/index.html", 2000);
            } else {
                document.getElementById("loginMessage").innerHTML = `<p class='error'>Ошибка: ${data.message}</p>`;
            }
        });
    }
});
