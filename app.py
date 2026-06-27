import requests
import json
import os
from flask import Flask, jsonify, render_template

app = Flask(__name__)
DB_FILE = 'ma_base.json'

# Charge la base locale au démarrage
def load_db():
    if os.path.exists(DB_FILE):
        with open(DB_FILE, 'r') as f: return json.load(f)
    return {}

# Sauvegarde un nouveau produit
def save_to_db(barcode, data):
    db = load_db()
    db[barcode] = data
    with open(DB_FILE, 'w') as f: json.dump(db, f)

@app.route('/get_product_info/<barcode>')
def get_product_info(barcode):
    db = load_db()
    # 1. Si on connaît déjà le produit, on le renvoie immédiatement
    if barcode in db: return jsonify(db[barcode])

    # 2. Sinon, on interroge Open Food Facts
    url = f"https://world.openfoodfacts.org/api/v0/product/{barcode}.json"
    try:
        response = requests.get(url, timeout=5)
        data = response.json()
        if data.get('status') == 1:
            prod = data.get('product', {})
            info = {
                "name": prod.get('product_name', 'Inconnu'),
                "nutriscore": str(prod.get('nutriscore_grade', 'n/a')).upper(),
                "ingredients": prod.get('ingredients_text_fr') or "Non listé"
            }
            # On enregistre pour la prochaine fois
            save_to_db(barcode, info)
            return jsonify(info)
        return jsonify({"error": "Produit introuvable"}), 404
    except:
        return jsonify({"error": "Erreur serveur"}), 500
