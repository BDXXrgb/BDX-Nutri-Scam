import requests
from flask import Flask, jsonify, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_product_info/<barcode>')
def get_product_info(barcode):
    # API française
    url = f"https://fr.openfoodfacts.org/api/v0/product/{barcode}.json"
    try:
        # Timeout réduit pour éviter de bloquer le serveur
        response = requests.get(url, timeout=3)
        data = response.json()
        
        if data.get('status') == 1:
            product = data.get('product', {})
            return jsonify({
                "name": product.get('product_name', 'Produit sans nom'),
                "nutriscore": str(product.get('nutriscore_grade', 'inconnu')).upper(),
                "ingredients": product.get('ingredients_text_fr') or "Ingrédients non listés"
            })
        return jsonify({"error": "Produit introuvable."}), 404
    except:
        return jsonify({"error": "Serveur occupé, réessaie."}), 500

if __name__ == '__main__':
    app.run(debug=True)
