async function generateQRCode() {
    const url = document.getElementById("url").value.trim();
    const resultDiv = document.getElementById("qrcodeResult");
    const downloadBtn = document.getElementById("downloadBtn");

    if (!url || !url.startsWith("http")) {
        resultDiv.innerHTML = "<p class='error'>Введите корректную ссылку (начинается с http или https)!</p>";
        return;
    }

    try {
        const res = await fetch(`/qrcode?url=${encodeURIComponent(url)}`);
        const data = await res.json();

        if (res.ok && data.qrCode) {
            resultDiv.innerHTML = `<img src="${data.qrCode}" alt="QR Code">`;
            downloadBtn.style.display = "block";
            downloadBtn.setAttribute("data-url", data.qrCode);
        } else {
            resultDiv.innerHTML = `<p class='error'>Ошибка генерации QR-кода.</p>`;
            downloadBtn.style.display = "none";
        }
    } catch (error) {
        resultDiv.innerHTML = `<p class='error'>Ошибка сервера.</p>`;
    }
}

function downloadQRCode() {
    const qrCodeUrl = document.getElementById("downloadBtn").getAttribute("data-url");
    const a = document.createElement("a");
    a.href = qrCodeUrl;
    a.download = "qrcode.png";
    a.click();
}
