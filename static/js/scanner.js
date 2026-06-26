// On attend que la page soit bien chargée
window.addEventListener('load', function () {
    const html5QrCode = new Html5Qrcode("reader");

    const config = {
        fps: 10,
        qrbox: { width: 250, height: 150 },
        // On définit les formats ici
        formatsToSupport: [ 
            Html5QrcodeSupportedFormats.EAN_13, 
            Html5QrcodeSupportedFormats.EAN_8 
        ]
    };

    html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
            // Si on scanne, on met à jour la page
            document.getElementById('resultat').innerHTML = "Code trouvé : " + decodedText;
            html5QrCode.stop();
        },
        (errorMessage) => {
            // On ignore les erreurs de scan, c'est normal quand il ne trouve rien
        }
    ).catch((err) => {
        document.getElementById('resultat').innerHTML = "Erreur caméra : " + err;
    });
});
