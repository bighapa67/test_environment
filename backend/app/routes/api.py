from flask import Blueprint, jsonify

bp = Blueprint('api', __name__, url_prefix='/api')

@bp.route('/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Hello from the API!"}), 200