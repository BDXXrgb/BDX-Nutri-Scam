// Initialisation propre du scanner
const html5QrCode = new Html5Qrcode("reader");

const config = { 
    fps: 10, 
    qrbox: { width: 250, height: 150 },
    // On définit les formats ici une seule fois
    formatsToSupport: [ 
        Html5QrcodeSupportedFormats.EAN_13, 
        Html5QrcodeSupportedFormats.EAN_8 
    ]
};

// Démarrage de la caméra
html5QrCode.start(
    { facingMode: "environment" }, 
    config,
    (decodedText) => {
        // Succès : on a trouvé le code !
        alert("Code-barres trouvé : " + decodedText);
        // On arrête le scanner après la lecture pour éviter les alertes en boucle
        html5QrCode.stop();
    },
    (errorMessage) => {
        // On ne fait rien pour les erreurs de scan, c'est normal
    }
).catch((err) => {
    console.error("Erreur de caméra : ", err);
    alert("Erreur caméra : " + err);
});
