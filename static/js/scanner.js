// Initialisation du scanner avec support explicite pour les codes-barres
const html5QrCode = new Html5Qrcode("reader");

const config = { 
    fps: 10, 
    qrbox: { width: 250, height: 150 },
    // On force la recherche des formats EAN 13 et 8 (ceux des produits)
    formatsToSupport: [ 
        Html5QrcodeSupportedFormats.EAN_13, 
        Html5QrcodeSupportedFormats.EAN_8 
    ]
};

html5QrCode.start(
    { facingMode: "environment" }, 
    config,
    (decodedText) => {
        // Succès : on a trouvé un numéro !
        alert("Code-barres trouvé : " + decodedText);
        // Ici tu pourras rediriger vers ton API plus tard
    },
    (errorMessage) => {
        // On ignore les erreurs de scan répétitives pour ne pas saturer l'écran
    }
).catch((err) => {
    console.error("Erreur d'initialisation du scanner : ", err);
});
