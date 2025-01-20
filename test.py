import pandas as pd

import pickle

input = {
    # Input Parameters
    "Age" : 60,              # Age (years)

    "Sex" : 'M',             # 'M' (Male) or 'F' (Female)

    "ChestPainType" : 'ASY', # 'TA' (Typical Angina), 'ATA' (Atypical Angina), 
                             # 'NAP' (Non-Anginal Pain), 'ASY' (Asymptomatic)

    "RestingBP" : 100,       # Resting Blood Pressure (mm Hg)

    "Cholesterol" : 248,     # Serum Cholesterol (mm/dl)

    "FastingBS" : 0,         # Fasting Blood Sugar (mg/dl)
                             # 1 if FastingBS > 120, otherwise 0

    "RestingECG" : 'Normal', # Resting Electrocardiogram Results
                             # 'Normal': Normal, 
                             # 'ST':     having ST-T wave abnormality 
                             # 'LVH':    showing probable or definite left 
                             #           ventricular hypertrophy by Estes' 
                             #           criteria

    "MaxHR" : 125,           # Max heart rate achieved
                             # (should be between 60 to 202)
                              
    "ExerciseAngina" : 'N',  # Exercise induced angina: 'Y' (Yes) / 'N' (No) 

    "Oldpeak" : 1.0,         # ST (Numeric values measured in depression)
    
    "ST_Slope" : 'Flat'      # Slope of the peak exercise ST segment
                             # 'Up':   upsloping
                             # 'Flat': flat
                             # 'Down': downsloping
}

# Output should be 1 (Heart Disease) by the following model for this input

df = pd.DataFrame([input])
string_col = df.select_dtypes(include="object").columns
df[string_col] = df[string_col].astype("string")

string_col = df.select_dtypes("string").columns.to_list()
num_col = df.columns.to_list()
for col in string_col:
    num_col.remove(col)

target = "HeartDisease"

# One Hot Encoding
df_nontree = pd.get_dummies(df, columns=string_col, drop_first=False)
bool_cols = df.select_dtypes(include=['bool']).columns
df_nontree[bool_cols] = df_nontree[bool_cols].astype(int)

# Label Encoding
from sklearn.preprocessing import LabelEncoder
df_tree = df.apply(LabelEncoder().fit_transform)

# loading the dataframe from training models (nontree)
dfNontree = pickle.load(open("dfNontree.pkl", "rb"))

features_col_nontree = dfNontree.columns.to_list()
features_col_nontree.remove(target)

missing_cols = set(dfNontree.columns) - set(df_nontree.columns) - {target}
for col in missing_cols:
    df_nontree[col] = 0

df_nontree = df_nontree[features_col_nontree]

# loading the dataframe from training models (tree)
dfTree = pickle.load(open("dfTree.pkl", "rb"))

features_col_tree = dfTree.columns.to_list()
features_col_tree.remove(target)

# loading the scaler back from training to scale input data
scaler = pickle.load(open("MinMaxScaler.pkl", "rb"))
scaled_df_nontree = scaler.transform(df_nontree)

# making a prediction
lrModel = pickle.load(open("webApp/model/Logistic Regression/logisticRegressionModel.pkl", "rb"))
print(f"Prediction: {lrModel.predict(scaled_df_nontree)}")
print(f"Probability: {lrModel.predict_proba(scaled_df_nontree)}")
# 0 - Normal
# 1 - HeartDisease