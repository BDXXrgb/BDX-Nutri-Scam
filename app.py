import requests
from flask import Flask, jsonify, render_template

app = Flask(__name__, template_folder='templates', static_folder='static')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_product_info/<barcode>')
def get_product_info(barcode):
    # Utilisation de l'API mondiale pour plus de résultats
    url = f"https://world.openfoodfacts.org/api/v0/product/{barcode}.json"
    try:
        # On ajoute un timeout pour éviter que le serveur ne reste bloqué
        response = requests.get(url, timeout=10)
        response.raise_for_status() # Lève une erreur si la requête échoue
        data = response.json()
        
        if data.get('status') == 1:
            product = data.get('product', {})
            return jsonify({
                "name": product.get('product_name', 'Produit inconnu'),
                "nutriscore": str(product.get('nutriscore_grade', 'N/A')).upper(),
                "ingredients": product.get('ingredients_text_fr') or "Ingrédients non listés"
            })
        else:
            return jsonify({"error": "Produit non trouvé"}), 404
            
    except Exception as e:
        # CETTE LIGNE EST TRÈS IMPORTANTE
        # Elle va afficher l'erreur réelle dans tes logs Render
        print(f"DEBUG_ERREUR: {e}")
        return jsonify({"error": "Erreur interne"}), 500

if __name__ == '__main__':
    app.run()
