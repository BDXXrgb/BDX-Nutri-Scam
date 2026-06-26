window.addEventListener('load', function () {
    const html5QrCode = new Html5Qrcode("reader");

    // Configuration optimisée pour mobile
    const config = { 
        fps: 10, 
        qrbox: 250, 
        aspectRatio: 1.0,
        formatsToSupport: [Html5QrcodeSupportedFormats.EAN_13] 
    };

    // On tente de démarrer la caméra arrière directement
    html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
            // Scan réussi, on arrête la caméra pour libérer la mémoire
            html5QrCode.stop().then(() => {
                document.getElementById('resultat').innerHTML = "🔎 Analyse en cours...";
                
                // Appel vers le serveur
                fetch('/get_product_info/' + decodedText)
                    .then(res => res.json())
                    .then(data => {
                        if (data.error) {
                            document.getElementById('resultat').innerHTML = `
                                ❌ ${data.error}<br><br>
                                <button onclick="location.reload()">Réessayer</button>`;
                        } else {
                            document.getElementById('resultat').innerHTML = `
                                <h2 style="color: #27ae60;">${data.name}</h2>
                                <p><strong>Nutri-Score:</strong> ${data.nutriscore}</p>
                                <p><strong>Ingrédients:</strong> ${data.ingredients}</p>
                                <br>
                                <button onclick="location.reload()">Scanner un autre</button>
                            `;
                        }
                    })
                    .catch(() => {
                        document.getElementById('resultat').innerHTML = "❌ Connexion au serveur impossible.";
                    });
            });
        },
        (errorMessage) => {
            // On ignore les erreurs de scan répétitives pendant la recherche
        }
    ).catch(err => {
        // Cette erreur survient si la permission caméra est refusée
        document.getElementById('resultat').innerHTML = `
            <h3>Accès caméra requis</h3>
            <p style="color:red;">Erreur : ${err}</p>
            <p>Vérifie que tu as bien autorisé la caméra dans les réglages de ton navigateur.</p>
        `;
    });
});
