window.addEventListener('load', function () {
    const html5QrCode = new Html5Qrcode("reader");

    html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
            html5QrCode.stop();
            const resDiv = document.getElementById('resultat');
            resDiv.innerHTML = "📡 Envoi du code au serveur : " + decodedText;

            fetch('/get_product_info/' + decodedText)
                .then(res => {
                    if (!res.ok) throw new Error("Erreur HTTP " + res.status);
                    return res.json();
                })
                .then(data => {
                    resDiv.innerHTML = `
                        <h2>${data.name}</h2>
                        <p><strong>Nutri-Score:</strong> ${data.nutriscore}</p>
                        <p><strong>Ingrédients:</strong> ${data.ingredients}</p>
                        <button onclick="location.reload()">Scanner un autre</button>
                    `;
                })
                .catch(err => {
                    resDiv.innerHTML = "❌ Erreur : " + err.message + "<br>Vérifie les logs sur Render.";
                });
        }
    ).catch(err => {
        document.getElementById('resultat').innerHTML = "Caméra bloquée : " + err;
    });
});
