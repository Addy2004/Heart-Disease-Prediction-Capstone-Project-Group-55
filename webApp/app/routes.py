import pickle
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.layers import Dropout
from tensorflow.keras.saving import register_keras_serializable
from flask import Blueprint, request, jsonify
from sklearn.preprocessing import LabelEncoder

# Blueprint for routes
routes = Blueprint('routes', __name__)

# Trained models 
logisticRegressionModel = pickle.load(open("model/Logistic Regression/logisticRegressionModel.pkl", 'rb'))
randomForestModel = pickle.load(open("model/Random Forest/randomForestModel.pkl", "rb"))

# Custom class structure for neural network model
@register_keras_serializable()
class improvedModelMCDropout(Dropout):
    def call(self, inputs, training=None):
        return super().call(inputs, training=True)

neuralNetworkModel = tf.keras.models.load_model("model/Neural Network/improvedNeuralNetworkModel.keras", custom_objects={'improvedModelMCDropout' : improvedModelMCDropout})

# Preprocessors
df_nontree_temp = pickle.load(open('model/dfNontree.pkl', 'rb'))
df_tree_temp = pickle.load(open('model/dfTree.pkl', 'rb'))
scaler = pickle.load(open('model/MinMaxScaler.pkl', 'rb'))

@routes.route('/predict', methods=['POST'])
def predict():
    try:
        input = request.json

        model_type = input.get('model_type', 'nontree').lower()

        input.pop('model_type', None)

        df = pd.DataFrame([input])
        string_col = df.select_dtypes(include="object").columns
        df[string_col] = df[string_col].astype("string")

        string_col = df.select_dtypes("string").columns.to_list()
        num_col = df.columns.to_list()
        for col in string_col:
            num_col.remove(col)

        target = "HeartDisease"

        if model_type == 'nontree':
            # One-Hot encoding
            df_nontree = pd.get_dummies(df, columns=string_col, drop_first=False)
            bool_cols = df.select_dtypes(include=['bool']).columns
            df_nontree[bool_cols] = df_nontree[bool_cols].astype(int)

            features_col_nontree = df_nontree_temp.columns.to_list()
            features_col_nontree.remove(target)

            missing_cols = set(df_nontree_temp.columns) - set(df_nontree.columns) - {target}
            for col in missing_cols:
                df_nontree[col] = 0
            df_nontree = df_nontree[features_col_nontree]

            # Scaling
            scaled_input = scaler.transform(df_nontree)

            # Prediction
            prediction = int(logisticRegressionModel.predict(scaled_input)[0])
            probability = logisticRegressionModel.predict_proba(scaled_input).tolist()[0]
        
        elif model_type == 'tree':
            # Tree model preprocessing
            df_tree = df.apply(LabelEncoder().fit_transform)

            features_col_tree = df_tree_temp.columns.to_list()
            features_col_tree.remove(target)

            # Prediction
            prediction = int(randomForestModel.predict(df_tree)[0])
            probability = randomForestModel.predict_proba(df_tree).tolist()[0]

        elif model_type == 'neural_network':
            # Tree model preprocessing
            df_tree = df.apply(LabelEncoder().fit_transform)

            features_col_tree = df_tree_temp.columns.to_list()
            features_col_tree.remove(target)
            
            threshold = 0.5

            # Prediction
            pred = neuralNetworkModel.predict(df_tree)
            binary_pred = int(np.where(pred > threshold, 1, 0)[0][0])

            prediction = binary_pred
            probability = pred.tolist()[0]

        else:
            return jsonify({"error" : "Invalid model_type"}), 400

        return jsonify({
            "model_type" : model_type,
            "prediction" : prediction,
            "probability" : probability
        })
    except Exception as e:
        return jsonify({'error' : str(e)}), 500