function onScanSuccess(decodedText) {
    fetch('/scan', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({code: decodedText})
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            document.getElementById('resultat').innerText = data.error;
        } else {
            document.getElementById('resultat').innerHTML = 
                `<h3>${data.nom}</h3>
                 <p><strong>Score Nutri :</strong> ${data.score}</p>
                 <p><strong>Ingrédients :</strong> ${data.ingredients}</p>`;
        }
    });
}

let html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
html5QrcodeScanner.render(onScanSuccess);