import requests
from flask import Flask, jsonify, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_product_info/<barcode>')
def get_product_info(barcode):
    url = f"https://world.openfoodfacts.org/api/v0/product/{barcode}.json"
    try:
        response = requests.get(url)
        data = response.json()
        
        if data.get('status') == 1:
            product = data.get('product', {})
            return jsonify({
                "name": product.get('product_name', 'Produit inconnu'),
                "nutriscore": str(product.get('nutriscore_grade', 'n/a')).upper(),
                "ingredients": product.get('ingredients_text', 'Ingrédients non disponibles')
            })
        return jsonify({"error": "Produit non trouvé"}), 404
    except:
        return jsonify({"error": "Erreur serveur"}), 500

if __name__ == '__main__':
    app.run(debug=True)
