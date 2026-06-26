window.addEventListener('load', function () {
    const html5QrCode = new Html5Qrcode("reader");
    
    const config = { 
        fps: 10, 
        qrbox: { width: 250, height: 150 },
        formatsToSupport: [Html5QrcodeSupportedFormats.EAN_13, Html5QrcodeSupportedFormats.EAN_8]
    };

    html5QrCode.start({ facingMode: "environment" }, config, (decodedText) => {
        document.getElementById('resultat').innerHTML = "🔎 Analyse approfondie en cours...";
        html5QrCode.stop().catch(err => console.log(err));

        fetch('/get_product_info/' + decodedText)
            .then(response => response.json())
            .then(data => {
                const resDiv = document.getElementById('resultat');
                if (data.error) {
                    resDiv.innerHTML = `<p class="error">❌ ${data.error}</p>
                                        <br><button onclick="location.reload()">Réessayer</button>`;
                } else {
                    resDiv.innerHTML = `
                        <h2 class="success">${data.name}</h2>
                        <p><strong>Nutri-Score :</strong> ${data.nutriscore}</p>
                        <p style="text-align: left; font-size: 0.95em;"><strong>Ingrédients :</strong><br>${data.ingredients}</p>
                        <br><button onclick="location.reload()">Scanner un autre produit</button>
                    `;
                }
            })
            .catch(() => {
                document.getElementById('resultat').innerHTML = "Erreur de connexion au serveur.";
            });
    }, (err) => {});
});
