from application.utils import predictionsJSONResponse, validateInput, logger
from flask import Blueprint, request, jsonify
import logging
import traceback

# Logging configuration
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Blueprint for routes
routes = Blueprint('routes', __name__)

@routes.route('/predict', methods=['POST'])
def predict():
    try:
        input = request.json
        logging.info(f"Received request: {input}")

        # Validate input
        errors = validateInput(input)
        if errors:
            logging.error(f"Validation errors: {errors}")
            return jsonify({"status" : "error", "errors" : errors}), 400
        
        predictions = predictionsJSONResponse(input)
        logging.info(f"Predictions successful : {predictions}")
        return predictions

    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        logging.error(traceback.format_exc())

        log_output = "".join([f"{log.message}\n" for log in logger.handlers[0].buffer]) if logger.handlers else "No logs captured."
        return jsonify({"status": "error", 
                        "message" : "An expected error occurred.",
                        "logs" : log_output}), 500