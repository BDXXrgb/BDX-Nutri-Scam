import requests
from flask import Flask, jsonify, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_product_info/<barcode>')
def get_product_info(barcode):
    # Utilisation de l'API française pour une meilleure précision
    url = f"https://fr.openfoodfacts.org/api/v0/product/{barcode}.json"
    try:
        response = requests.get(url, timeout=5)
        data = response.json()
        
        if data.get('status') == 1:
            product = data.get('product', {})
            
            # Recherche intelligente des ingrédients
            ingredients = product.get('ingredients_text_fr') or product.get('ingredients_text')
            
            # Si le texte est vide, on tente de reconstruire depuis la liste structurée
            if not ingredients:
                ingredients_list = product.get('ingredients', [])
                if ingredients_list:
                    ingredients = ", ".join([i.get('text', '') for i in ingredients_list if i.get('text')])
            
            return jsonify({
                "name": product.get('product_name', 'Produit sans nom'),
                "nutriscore": str(product.get('nutriscore_grade', 'inconnu')).upper(),
                "ingredients": ingredients or "Ingrédients non listés dans la base."
            })
        else:
            return jsonify({"error": "Produit introuvable dans la base de données."}), 404
    except Exception:
        return jsonify({"error": "Erreur de connexion au serveur."}), 500

if __name__ == '__main__':
    app.run(debug=True)
