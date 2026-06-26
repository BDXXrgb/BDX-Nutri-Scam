function onScanSuccess(decodedText, decodedResult) {
    console.log(`Code scanné : ${decodedText}`);
    alert("Produit scanné : " + decodedText);
    // Plus tard, on pourra envoyer ça au serveur avec : 
    // window.location.href = "/product/" + decodedText;
}

// Configuration pour lire spécifiquement les codes-barres (EAN_13)
let config = {
    fps: 10,
    qrbox: { width: 250, height: 150 },
    rememberLastUsedCamera: true,
    supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
    formatsToSupport: [ Html5QrcodeSupportedFormats.EAN_13, Html5QrcodeSupportedFormats.EAN_8 ]
};

let html5QrcodeScanner = new Html5QrcodeScanner(
    "reader", config, /* verbose= */ false);

html5QrcodeScanner.render(onScanSuccess);
