window.addEventListener('load', function () {
    const html5QrCode = new Html5Qrcode("reader");

    html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250, formatsToSupport: [Html5QrcodeSupportedFormats.EAN_13] },
        (decodedText) => {
            html5QrCode.stop();
            document.getElementById('resultat').innerHTML = "⏳ Chargement...";

            fetch('/get_product_info/' + decodedText)
                .then(res => res.json())
                .then(data => {
                    if (data.error) {
                        document.getElementById('resultat').innerHTML = `❌ ${data.error}<br><button onclick="location.reload()">Réessayer</button>`;
                    } else {
                        document.getElementById('resultat').innerHTML = `
                            <h2>${data.name}</h2>
                            <p><strong>Nutri-Score:</strong> ${data.nutriscore}</p>
                            <p><strong>Ingrédients:</strong> ${data.ingredients}</p>
                            <button onclick="location.reload()">Scanner un autre</button>
                        `;
                    }
                })
                .catch(() => {
                    document.getElementById('resultat').innerHTML = "❌ Connexion échouée.<br><button onclick="location.reload()">Réessayer</button>";
                });
        }
    );
});
