import requests
from flask import Flask, jsonify, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_product_info/<barcode>')
def get_product_info(barcode):
    # On utilise l'API française pour avoir plus de chances de trouver le produit
    url = f"https://fr.openfoodfacts.org/api/v0/product/{barcode}.json"
    try:
        response = requests.get(url, timeout=5)
        data = response.json()
        
        if data.get('status') == 1:
            product = data.get('product', {})
            return jsonify({
                "name": product.get('product_name', 'Produit sans nom'),
                "nutriscore": str(product.get('nutriscore_grade', 'inconnu')).upper(),
                "ingredients": product.get('ingredients_text', 'Ingrédients non listés')
            })
        else:
            return jsonify({"error": "Produit introuvable dans la base de données."}), 404
    except Exception as e:
        return jsonify({"error": "Erreur de communication avec le serveur."}), 500

if __name__ == '__main__':
    app.run(debug=True)
