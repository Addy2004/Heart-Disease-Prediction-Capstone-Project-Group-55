import pandas as pd
from sklearn import model_selection
from sklearn.svm import SVC
from sklearn.metrics import classification_report, roc_auc_score
from sklearn.preprocessing import MinMaxScaler
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

df_nontree = pd.get_dummies(df,
                            columns=string_col,
                            drop_first=False)

bool_cols = df_nontree.select_dtypes(include=['bool']).columns
df_nontree[bool_cols] = df_nontree[bool_cols].astype(int)
target = "HeartDisease"
y = df_nontree[target].values
df_nontree.drop("HeartDisease", axis=1, inplace=True)
df_nontree = pd.concat([df_nontree, df[target]], axis=1)
df_nontree.head()

feature_col_nontree = df_nontree.columns.to_list()
feature_col_nontree.remove(target)

acc_svm = []
kf = model_selection.StratifiedKFold(n_splits=5)
for fold, (trn_, val_) in enumerate(kf.split(X=df_nontree, y=y)):
    X_train = df_nontree.loc[trn_, feature_col_nontree]
    y_train = df_nontree.loc[trn_, target]

    X_valid = df_nontree.loc[val_, feature_col_nontree]
    y_valid = df_nontree.loc[val_, target]

    scaler = MinMaxScaler()
    X_train = scaler.fit_transform(X_train)
    X_valid = scaler.transform(X_valid)

    clf = SVC(kernel="rbf", random_state=69, probability=True)
    clf.fit(X_train, y_train)
    y_pred = clf.predict(X_valid)

    print(f"The fold is : {fold} : ")
    print(classification_report(y_valid, y_pred))
    acc = roc_auc_score(y_valid, y_pred)
    acc_svm.append(acc)
    print(f"The accuracy for {fold + 1} : {acc}")
    pass

pickle.dump(clf, open("rbfKernelSVM.pkl", "wb"))