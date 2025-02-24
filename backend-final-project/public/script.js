document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");
    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");
    const welcomeText = document.getElementById("welcomeText");

    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (token && username) {
        welcomeText.innerText = `Привет, ${username}!`;
        logoutBtn.style.display = "inline-block";
        loginBtn.style.display = "none";
        registerBtn.style.display = "none";
    } else {
        welcomeText.innerText = "Вы не вошли в систему!";
        logoutBtn.style.display = "none";
        loginBtn.style.display = "inline-block";
        registerBtn.style.display = "inline-block";
    }

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        alert("Вы вышли из системы!");
        window.location.href = "/login.html";
    });
});

