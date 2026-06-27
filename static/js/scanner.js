window.addEventListener('load', function () {
    const html5QrCode = new Html5Qrcode("reader");

    html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
            html5QrCode.stop();
            document.getElementById('resultat').innerHTML = "⏳ Recherche...";

            fetch('/get_product_info/' + decodedText)
                .then(res => res.json())
                .then(data => {
                    if (data.error === "INCONNU") {
                        // Si inconnu, on propose d'ajouter
                        const nom = prompt("Produit inconnu. Entre le nom :");
                        const ing = prompt("Entre les ingrédients :");
                        if (nom && ing) {
                            fetch('/add_product', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ barcode: decodedText, name: nom, ingredients: ing })
                            }).then(() => alert("Merci ! Produit enregistré."));
                        }
                    } else if (data.error) {
                        document.getElementById('resultat').innerHTML = "❌ " + data.error;
                    } else {
                        document.getElementById('resultat').innerHTML = `
                            <h2>${data.name}</h2>
                            <p><strong>Ingrédients :</strong> ${data.ingredients}</p>
                            <button onclick="location.reload()">Scanner un autre</button>
                        `;
                    }
                })
                .catch(() => {
                    document.getElementById('resultat').innerHTML = "❌ Erreur serveur.";
                });
        }
    );
});
