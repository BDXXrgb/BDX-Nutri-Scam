import requests
import json
import os
from flask import Flask, jsonify, render_template, request

app = Flask(__name__)
DB_FILE = 'ma_base.json'

def load_db():
    if os.path.exists(DB_FILE):
        with open(DB_FILE, 'r') as f: return json.load(f)
    return {}

@app.route('/add_product', methods=['POST'])
def add_product():
    data = request.json
    db = load_db()
    db[data['barcode']] = {
        "name": data['name'],
        "ingredients": data['ingredients'],
        "nutriscore": "N/A"
    }
    with open(DB_FILE, 'w') as f: json.dump(db, f)
    return jsonify({"status": "success"})

@app.route('/get_product_info/<barcode>')
def get_product_info(barcode):
    db = load_db()
    if barcode in db: return jsonify(db[barcode])

    url = f"https://world.openfoodfacts.org/api/v0/product/{barcode}.json"
    try:
        response = requests.get(url, timeout=5)
        data = response.json()
        if data.get('status') == 1:
            prod = data.get('product', {})
            return jsonify({
                "name": prod.get('product_name', 'Inconnu'),
                "nutriscore": str(prod.get('nutriscore_grade', 'n/a')).upper(),
                "ingredients": prod.get('ingredients_text_fr') or "Non listé"
            })
        return jsonify({"error": "INCONNU"}), 404
    except: return jsonify({"error": "Serveur HS"}), 500

if __name__ == '__main__':
    app.run()
