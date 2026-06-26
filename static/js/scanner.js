window.addEventListener('load', function () {
    const readerElement = document.getElementById("reader");
    if (!readerElement) return;

    const html5QrCode = new Html5Qrcode("reader");

    const config = { 
        fps: 10, 
        qrbox: { width: 250, height: 150 },
        formatsToSupport: [ 
            Html5QrcodeSupportedFormats.EAN_13, 
            Html5QrcodeSupportedFormats.EAN_8 
        ]
    };

    html5QrCode.start(
        { facingMode: "environment" }, 
        config,
        (decodedText) => {
            // Affichage immédiat pour confirmer le scan
            document.getElementById('resultat').innerHTML = "📦 Recherche des infos...";
            
            // On arrête la caméra pour ne pas surcharger le processeur
            html5QrCode.stop().catch(err => console.log(err));

            // Appel à ton serveur Flask
            fetch('/get_product_info/' + decodedText)
                .then(response => response.json())
                .then(data => {
                    const resDiv = document.getElementById('resultat');
                    if (data.error) {
                        resDiv.innerHTML = `<p class="error">❌ Produit non trouvé en base.</p>
                                            <button onclick="location.reload()">Réessayer</button>`;
                    } else {
                        resDiv.innerHTML = `
                            <h2 class="success">${data.name}</h2>
                            <p><strong>Nutri-Score :</strong> ${data.nutriscore}</p>
                            <p style="font-size: 0.9em;"><strong>Ingrédients :</strong> ${data.ingredients}</p>
                            <br>
                            <button onclick="location.reload()">Scanner un autre produit</button>
                        `;
                    }
                })
                .catch(() => {
                    document.getElementById('resultat').innerHTML = '<p class="error">Erreur de connexion au serveur.</p>';
                });
        },
        (errorMessage) => {
            // On ne fait rien pour les erreurs de scan répétitives
        }
    ).catch((err) => {
        document.getElementById('resultat').innerHTML = "Erreur caméra : " + err;
    });
});
