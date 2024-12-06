import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.callbacks import ModelCheckpoint
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

df = pd.read_csv('heart.csv')

cols_to_enc = ['ChestPainType',
               'ExerciseAngina',
               'RestingECG',
               'Sex',
               'ST_Slope']

enc = LabelEncoder()
for col in cols_to_enc:
    if col in df.columns:
        df[col] = enc.fit_transform(df[col])

y = df['HeartDisease']
X = df.drop('HeartDisease', axis=1)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = Sequential()
model.add(Dense(128, activation='relu'))
model.add(Dropout(0.2))

model.add(Dense(64, activation='relu'))
model.add(Dropout(0.2))

model.add(Dense(32, activation='relu'))
model.add(Dropout(0.2))

model.add(Dense(64, input_dim=X_train.shape[1], activation='relu'))
model.add(Dropout(0.2))

model.add(Dense(32, activation='relu'))
model.add(Dropout(0.2))

model.add(Dense(1, activation='sigmoid'))

model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])

checkpoint = ModelCheckpoint('Models/Neural Network/neuralNetworkModel.keras', monitor='val_accuracy', mode='max', save_best_only=True, verbose=1)

model.fit(X_train, y_train, epochs=2000, batch_size=64, validation_split=0.1, callbacks=[checkpoint], verbose = 1)

finalModel = tf.keras.models.load_model('Models/Neural Network/neuralNetworkModel.keras')

probs = finalModel.predict(X_test)

threshold = 0.5

bin_pred = np.where(probs > threshold, 1, 0)

print("Classification Report: ")
print(classification_report(y_test, bin_pred))