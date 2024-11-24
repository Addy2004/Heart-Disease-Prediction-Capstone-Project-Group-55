import pandas as pd
from sklearn import model_selection
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score
from sklearn.preprocessing import LabelEncoder
import pickle
pd.set_option("display.max_rows", None)

df = pd.read_csv("heart.csv")

string_col = df.select_dtypes(include="object").columns
df[string_col] = df[string_col].astype("string")
string_col = df.select_dtypes("string").columns.to_list()
num_col = df.columns.to_list()
for col in string_col:
    num_col.remove(col)
num_col.remove("HeartDisease")

df_tree = df.apply(LabelEncoder().fit_transform)
target = "HeartDisease"
y = df_tree[target].values
df_tree.drop("HeartDisease", axis=1, inplace=True)
df_tree = pd.concat([df_tree, df[target]], axis=1)
df_tree.head()

feature_col_tree = df_tree.columns.to_list()
feature_col_tree.remove(target)

acc_RandF = []
kf = model_selection.StratifiedKFold(n_splits=5)
for fold, (trn_, val_) in enumerate(kf.split(X=df_tree, y=y)):
    X_train = df_tree.loc[trn_, feature_col_tree]
    y_train = df_tree.loc[trn_, target]

    X_valid = df_tree.loc[val_, feature_col_tree]
    y_valid = df_tree.loc[val_, target]

    clf = RandomForestClassifier(n_estimators=200, criterion='entropy', random_state=69)
    clf.fit(X_train, y_train)
    y_pred = clf.predict(X_valid)
    
    print(f"The fold is : {fold} : ")
    print(classification_report(y_valid, y_pred))
    acc = roc_auc_score(y_valid, y_pred)
    acc_RandF.append(acc)
    print(f"The accuracy for {fold + 1} : {acc}")
    pass

pickle.dump(clf, open("randomForestModel.pkl", "wb"))
