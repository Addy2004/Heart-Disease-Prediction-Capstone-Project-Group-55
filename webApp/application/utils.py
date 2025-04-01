import time
import logging
import pickle
import numpy as np
import pandas as pd
import tensorflow as tf
from flask import jsonify
from tensorflow.keras.layers import Dropout
from tensorflow.keras.saving import register_keras_serializable
from sklearn.preprocessing import LabelEncoder

logger = logging.getLogger(__name__)

VALID_SEX = ['M', 'F']
VALID_CHEST_PAIN = ['TA', 'ATA', 'NAP', 'ASY']
VALID_RESTING_ECG = ['Normal', 'ST', 'LVH']
VALID_EXERCISE_ANGINA = ['Y', 'N']
VALID_ST_SLOPE = ['Up', 'Flat', 'Down']

def validateInput(data):
    errors = []

    # Validation checks
    if 'Age' not in data or not isinstance(data['Age'], int) or not (0 <= data['Age'] <= 120):
        errors.append("Invalid or missing 'Age'. Must be an integer between 0 and 120.")
    if 'Sex' not in data or data['Sex'] not in VALID_SEX:
        errors.append("Invalid or missing 'Sex'. Must be 'M' or 'F'.")
    if 'ChestPainType' not in data or data['ChestPainType'] not in VALID_CHEST_PAIN:
        errors.append("Invalid or missing 'ChestPainType'. Must be 'TA', 'ATA', 'NAP', or 'ASY'.")
    if 'RestingBP' not in data or not isinstance(data['RestingBP'], int) or not (0 <= data['RestingBP'] <= 250):
        errors.append("Invalid or missing 'RestingBP'. Must be an integer between 0 and 250.")
    if 'Cholesterol' not in data or not isinstance(data['Cholesterol'], int) or not (0 <= data['Cholesterol'] <= 600):
        errors.append("Invalid or missing 'Cholesterol'. Must be an integer between 0 and 600.")
    if 'FastingBS' not in data or data['FastingBS'] not in [0, 1]:
        errors.append("Invalid or missing 'FastingBS'. Must be 0 or 1.")
    if 'RestingECG' not in data or data['RestingECG'] not in VALID_RESTING_ECG:
        errors.append("Invalid or missing 'RestingECG'. Must be 'Normal', 'ST', or 'LVH'.")
    if 'MaxHR' not in data or not isinstance(data['MaxHR'], int) or not (60 <= data['MaxHR'] <= 202):
        errors.append("Invalid or missing 'MaxHR'. Must be an integer between 60 and 202.")
    if 'ExerciseAngina' not in data or data['ExerciseAngina'] not in VALID_EXERCISE_ANGINA:
        errors.append("Invalid or missing 'ExerciseAngina'. Must be 'Y' or 'N'.")
    if 'Oldpeak' not in data or not isinstance(data['Oldpeak'], (int, float)) or data['Oldpeak'] < 0:
        errors.append("Invalid or missing 'Oldpeak'. Must be a non-negative number.")
    if 'ST_Slope' not in data or data['ST_Slope'] not in VALID_ST_SLOPE:
        errors.append("Invalid or missing 'ST_Slope'. Must be 'Up', 'Flat', or 'Down'.")

    return errors

# Custom class structure for neural network model.
@register_keras_serializable()
class improvedModelMCDropout(Dropout):
    def call(self, inputs, training=None):
        return super().call(inputs, training=True)

def load_model(model_path, is_keras=False):
    try:
        logger.info(f"Loading model from {model_path}")
        if is_keras:
            return tf.keras.models.load_model(model_path, custom_objects={'improvedModelMCDropout' : improvedModelMCDropout})
        else:
            return pickle.load(open(model_path, 'rb'))
    except Exception as e:
        logger.error(f"Error loading model from {model_path} : {str(e)}")
        raise

try:
    # Trained models (nontree)
    logisticRegressionModel = load_model("model/Logistic Regression/logisticRegressionModel.pkl")
    naiveBayersModel = load_model("model/Naive Bayers/naiveBayersModel.pkl")

    # Support Vector Machines (SVM)
    #       - Linear Kernel
    linearKernelSVMModel = load_model("model/Support Vector Machines/Linear Kernel/linearKernelSVM.pkl")
    #       - Sigmoid Kernel
    sigmoidKernelSVMModel = load_model("model/Support Vector Machines/Sigmoid Kernel/sigmoidKernelSVM.pkl")
    #       - RBF Kernel
    rbfKernelSVMModel = load_model("model/Support Vector Machines/RBF Kernel/rbfKernelSVM.pkl")
    #       - Polynomial Kernel
    polynomialKernelSVMModel = load_model("model/Support Vector Machines/Polynomial Kernel/polynomialKernelSVM.pkl")

    knnModel = load_model("model/KNN/knnModel.pkl")

    # Trained models (tree)
    decisionTreeClassifierModel = load_model("model/Decision Tree/decisionTreeClassifierModel.pkl")
    randomForestModel = load_model("model/Random Forest/randomForestModel.pkl")
    xgboostModel = load_model("model/XGBoost/xgboostModel.pkl")

    # Preprocessors
    df_nontree_temp = load_model('model/dfNontree.pkl')
    scaler = load_model('model/MinMaxScaler.pkl')
    encoders = load_model('model/label_encoders.pkl')

    df_tree_temp = load_model('model/dfTree.pkl')

    # Neural Network Model
    neuralNetworkModel = load_model("model/Neural Network/improvedNeuralNetworkModel.keras", is_keras=True)


except Exception as e:
    logger.critical(f"Fatal error occured while loading models: {str(e)}")
    raise

models_dict = {
    "logisticRegression"     : ["nontree", logisticRegressionModel, ""],
    "naiveBayers"            : ["nontree", naiveBayersModel, ""],
    "linearKernelSVM"        : ["nontree", linearKernelSVMModel, "svm"],
    "sigmoidKernelSVM"       : ["nontree", sigmoidKernelSVMModel, "svm"],
    "rbfKernelSVM"           : ["nontree", rbfKernelSVMModel, "svm"],
    "polynomialSVM"          : ["nontree", polynomialKernelSVMModel, "svm"],
    "KNN"                    : ["nontree", knnModel, ""],
    "decisionTreeClassifier" : ["tree", decisionTreeClassifierModel, ""],
    "randomForest"           : ["tree", randomForestModel, ""],
    "xgboost"                : ["tree", xgboostModel, ""],
    "neuralNetwork"          : ["neural", neuralNetworkModel, ""]
}

def predictionsJSONResponse(input):
    response = {"models" : {"nontree" : {"svm" : {}}, "tree" : {}}}

    start_time = time.time()

    for model_name, model in models_dict.items():
        try:
            df = pd.DataFrame([input])
            string_col = df.select_dtypes(include="object").columns
            df[string_col] = df[string_col].astype("string")

            string_col = df.select_dtypes("string").columns.to_list()
            num_col = df.columns.to_list()
            for col in string_col:
                num_col.remove(col)

            target = "HeartDisease"

            if(model[0] == "nontree"):
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
                prediction = int(model[1].predict(scaled_input)[0])
                probability = model[1].predict_proba(scaled_input).tolist()[0]

                if model[2] == "svm":
                    response["models"]["nontree"]["svm"][model_name] = {
                        "prediction" : int(prediction),
                        "probability" : probability
                    }
                
                else:
                    response["models"]["nontree"][model_name] = {
                        "prediction" : int(prediction),
                        "probability" : probability
                    }

            elif(model[0] == "tree"):
                df_test = pd.DataFrame([input])

                for col, encoder in encoders.items():
                    df_test[col] = encoder.transform(df_test[col])
                
                features_col_tree = df_tree_temp.columns.to_list()
                features_col_tree.remove(target)

                df_test = df_test[features_col_tree]

                # Prediction
                prediction = int(model[1].predict(df_test)[0])
                probability = model[1].predict_proba(df_test).tolist()[0]

                response["models"]["tree"][model_name] = {
                    "prediction" : int(prediction),
                    "probability" : probability
                }
            
            elif(model[0] == "neural"):
                # Tree model preprocessing
                df_tree = df.apply(LabelEncoder().fit_transform)

                features_col_tree = df_tree_temp.columns.to_list()
                features_col_tree.remove(target)
                
                threshold = 0.5

                # Prediction
                pred = model[1].predict(df_tree)
                binary_pred = int(np.where(pred > threshold, 1, 0)[0][0])

                prediction = binary_pred
                probability = pred.tolist()[0]

                response["models"][model_name] = {
                    "prediction" : int(prediction),
                    "probability" : probability
                }
            
            logger.info(f"Prediction successful for {model_name}. Prediction: {prediction}, Probability: {probability}")

        except Exception as e:
            logger.error(f"Error in prediction for {model_name}: {str(e)}")
            response["models"][model_name] =  {
                "status" : "error",
                "message" : f"Prediction failed for {model_name}"
            }
    end_time = time.time()
    processing_time = end_time - start_time
    logger.info(f"Prediction processing time : {processing_time:.4f} seconds")
    return jsonify(response)
