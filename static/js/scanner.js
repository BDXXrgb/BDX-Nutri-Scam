function onScanSuccess(decodedText, decodedResult) {
    // Quand un code est scanné, on affiche le résultat
    console.log(`Code scanné : ${decodedText}`);
    
    // Pour l'instant, on affiche une alerte pour confirmer que ça marche
    alert("Produit scanné : " + decodedText);
    
    // Ici, plus tard, on enverra ce code à ton serveur Flask
    // fetch('/get_info?barcode=' + decodedText) ...
}

let html5QrcodeScanner = new Html5QrcodeScanner(
    "reader", 
    { fps: 10, qrbox: { width: 250, height: 150 } },
    /* verbose= */ false);

html5QrcodeScanner.render(onScanSuccess);
