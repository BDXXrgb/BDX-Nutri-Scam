from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/scan', methods=['POST'])
def scan():
    data = request.json
    code = data.get('code')
    url = f"https://world.openfoodfacts.org/api/v0/product/{code}.json"
    
    try:
        reponse = requests.get(url).json()
        if reponse.get("status") == 1:
            prod = reponse["product"]
            return jsonify({
                "nom": prod.get("product_name", "Produit inconnu"),
                "score": prod.get("nutriscore_grade", "Non classé").upper(),
                "ingredients": prod.get("ingredients_text", "Ingrédients non listés")
            })
        return jsonify({"error": "Produit introuvable"})
    except:
        return jsonify({"error": "Erreur de connexion"})

if __name__ == '__main__':
    app.run(debug=True)