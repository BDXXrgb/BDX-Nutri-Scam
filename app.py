import requests
from flask import Flask, jsonify, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_product_info/<barcode>')
def get_product_info(barcode):
    url = f"https://fr.openfoodfacts.org/api/v0/product/{barcode}.json"
    try:
        # On ajoute un User-Agent car OpenFoodFacts le demande
        headers = {'User-Agent': 'BDXNutriScan/1.0'}
        response = requests.get(url, timeout=5, headers=headers)
        
        # Vérification si la requête a réussi
        response.raise_for_status() 
        data = response.json()
        
        if data.get('status') == 1:
            product = data.get('product', {})
            return jsonify({
                "name": product.get('product_name', 'Produit sans nom'),
                "nutriscore": str(product.get('nutriscore_grade', 'inconnu')).upper(),
                "ingredients": product.get('ingredients_text_fr') or "Non listé"
            })
        else:
            return jsonify({"error": "Produit non trouvé en base"}), 404
            
    except Exception as e:
        # C'est cette ligne qui est vitale ! 
        # Elle va afficher la VRAIE erreur dans tes logs Render.
        print(f"DEBUG ERREUR: {str(e)}") 
        return jsonify({"error": "Erreur serveur interne"}), 500

if __name__ == '__main__':
    app.run()
