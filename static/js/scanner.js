window.addEventListener('load', function () {
    const reader = document.getElementById('reader');
    const resultDiv = document.getElementById('resultat');
    const html5QrCode = new Html5Qrcode("reader");

    html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
            html5QrCode.stop();
            resultDiv.innerHTML = "📡 Analyse...";

            fetch('/get_product_info/' + decodedText)
                .then(res => res.json())
                .then(data => {
                    if (data.error) {
                        resultDiv.innerHTML = `❌ ${data.error} <br><br> <button onclick="location.reload()">Réessayer</button>`;
                    } else {
                        resultDiv.innerHTML = `
                            <h2>${data.name}</h2>
                            <p><strong>Nutri-Score:</strong> ${data.nutriscore}</p>
                            <p><strong>Ingrédients:</strong> ${data.ingredients}</p>
                            <br>
                            <button onclick="location.reload()">⬅️ Scanner un autre</button>
                        `;
                    }
                })
                .catch(() => {
                    resultDiv.innerHTML = "❌ Erreur de connexion au serveur.";
                });
        }
    );
});
