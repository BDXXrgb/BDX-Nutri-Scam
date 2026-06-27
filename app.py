import requests
from flask import Flask, jsonify, render_template

app = Flask(__name__, template_folder='templates', static_folder='static')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_product_info/<barcode>')
def get_product_info(barcode):
    url = f"https://world.openfoodfacts.org/api/v0/product/{barcode}.json"
    try:
        # Appel API avec User-Agent requis
        headers = {'User-Agent': 'BDXScanApp/1.0'}
        response = requests.get(url, timeout=5, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('status') == 1:
                p = data.get('product', {})
                return jsonify({
                    "name": p.get('product_name', 'Produit inconnu'),
                    "nutriscore": str(p.get('nutriscore_grade', 'N/A')).upper(),
                    "ingredients": p.get('ingredients_text_fr') or "Ingrédients non listés"
                })
        return jsonify({"error": "Produit non trouvé"}), 404
    except Exception as e:
        return jsonify({"error": "Erreur serveur : " + str(e)}), 500

if __name__ == '__main__':
    app.run()
