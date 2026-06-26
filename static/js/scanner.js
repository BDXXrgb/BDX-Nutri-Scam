window.addEventListener('load', function () {
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
            // On a trouvé un code, on demande les infos au serveur
            document.getElementById('resultat').innerHTML = "Recherche en cours...";
            
            fetch('/get_product_info/' + decodedText)
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        document.getElementById('resultat').innerHTML = "Produit non trouvé.";
                    } else {
                        document.getElementById('resultat').innerHTML = `
                            <h3>${data.name}</h3>
                            <p><strong>Nutri-Score :</strong> ${data.nutriscore}</p>
                            <p><strong>Ingrédients :</strong> ${data.ingredients}</p>
                        `;
                    }
                })
                .catch(() => {
                    document.getElementById('resultat').innerHTML = "Erreur de connexion au serveur.";
                });

            html5QrCode.stop(); // On arrête le scanner après la lecture
        },
        (errorMessage) => {
            // Erreurs de scan ignorées
        }
    );
});
