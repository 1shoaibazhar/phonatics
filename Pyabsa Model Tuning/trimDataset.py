import pandas as pd

df = pd.read_csv('Amazon_Unlocked_Mobile.csv', nrows = 4000)
df.to_csv('phoneData10000.csv')
