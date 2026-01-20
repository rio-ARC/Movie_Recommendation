import pandas as pd

df = pd.read_csv('movies.csv', nrows=5)
print("All columns in dataset:")
for col in df.columns:
    print(f"  - {col}")

print("\n\nSample data for poster-related fields:")
cols_of_interest = ['title', 'id', 'release_date', 'vote_average', 'genres', 'runtime', 'poster_path']
for col in cols_of_interest:
    if col in df.columns:
        print(f"\n{col}:")
        print(df[col].head())
    else:
        print(f"\n{col}: NOT FOUND in dataset")
