import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import requests
import io
import matplotlib.pyplot as plt
import pickle

# We'll use data described in the NCBI article about patient flow visualization and prediction
# For demonstration, we'll create a synthetic dataset based on the paper's description
np.random.seed(42)
n_samples = 500

# Generate dates for 41 months (as mentioned in the paper)
start_date = pd.to_datetime('2019-01-01')
dates = [start_date + pd.Timedelta(days=i) for i in range(41*30)]
dates = dates[:n_samples]

# Generate synthetic data based on the paper's description
data = {
    'Date': dates,
    'Month': [d.month for d in dates],
    'Year': [d.year for d in dates],
    'DayOfWeek': [d.dayofweek for d in dates],
    'IsHoliday': np.random.choice([0, 1], n_samples, p=[0.95, 0.05]),
    'Department': np.random.choice(['Emergency', 'Surgery', 'Internal Medicine', 'Pediatrics', 'Obstetrics'], n_samples),
    'OutpatientVisits': np.random.poisson(lam=235, size=n_samples),  # Based on mean mentioned in the paper
    'InpatientAdmissions': np.random.poisson(lam=50, size=n_samples),
    'StaffAvailable': np.random.randint(10, 30, n_samples),
    'BedsTotal': np.random.choice([100, 150, 200, 250, 300], n_samples),
    'BedsOccupied': np.zeros(n_samples),
    'AvgLengthOfStay': np.random.gamma(shape=2, scale=2, size=n_samples) + 2  # in days
}

df = pd.DataFrame(data)

# Create realistic bed occupancy based on admissions and length of stay
for i in range(n_samples):
    if i < 7:
        df.loc[i, 'BedsOccupied'] = df.loc[i, 'InpatientAdmissions'] * 0.8
    else:
        # Bed occupancy depends on previous admissions and average length of stay
        prev_admissions = sum(df.loc[max(0, i-7):i-1, 'InpatientAdmissions']) * 0.8
        df.loc[i, 'BedsOccupied'] = min(
            prev_admissions * df.loc[i, 'AvgLengthOfStay'] / 7,
            df.loc[i, 'BedsTotal'] * 0.95  # Max occupancy is 95% of total beds
        )

# Calculate bed occupancy rate
df['BedOccupancyRate'] = df['BedsOccupied'] / df['BedsTotal']

# Feature engineering
df['Month_sin'] = np.sin(2 * np.pi * df['Month']/12)
df['Month_cos'] = np.cos(2 * np.pi * df['Month']/12)
df['DayOfWeek_sin'] = np.sin(2 * np.pi * df['DayOfWeek']/7)
df['DayOfWeek_cos'] = np.cos(2 * np.pi * df['DayOfWeek']/7)

# Prepare features and target
features = ['Month_sin', 'Month_cos', 'DayOfWeek_sin', 'DayOfWeek_cos', 
            'IsHoliday', 'OutpatientVisits', 'InpatientAdmissions', 
            'StaffAvailable', 'AvgLengthOfStay', 'Year']
categorical_features = ['Department']
numeric_features = features

X = df[features + categorical_features]
y_beds = df['BedOccupancyRate']
y_staff = df['StaffAvailable'] * (df['OutpatientVisits'] / df['OutpatientVisits'].mean())  # Synthetic staff needs

# Preprocessing pipeline
numeric_transformer = StandardScaler()
categorical_transformer = OneHotEncoder(handle_unknown='ignore')

preprocessor = ColumnTransformer(
    transformers=[
        ('num', numeric_transformer, numeric_features),
        ('cat', categorical_transformer, categorical_features)
    ])

# Create models
bed_model = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('regressor', GradientBoostingRegressor(n_estimators=100, random_state=42))
])

staff_model = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('regressor', GradientBoostingRegressor(n_estimators=100, random_state=42))
])

# Split data
X_train, X_test, y_beds_train, y_beds_test, y_staff_train, y_staff_test = train_test_split(
    X, y_beds, y_staff, test_size=0.2, random_state=42)

# Train models
bed_model.fit(X_train, y_beds_train)
staff_model.fit(X_train, y_staff_train)

# Evaluate models
y_beds_pred = bed_model.predict(X_test)
y_staff_pred = staff_model.predict(X_test)

print("Bed Occupancy Rate Prediction:")
print(f"MAE: {mean_absolute_error(y_beds_test, y_beds_pred):.4f}")
print(f"RMSE: {np.sqrt(mean_squared_error(y_beds_test, y_beds_pred)):.4f}")
print(f"R²: {r2_score(y_beds_test, y_beds_pred):.4f}")

print("\nStaff Requirements Prediction:")
print(f"MAE: {mean_absolute_error(y_staff_test, y_staff_pred):.4f}")
print(f"RMSE: {np.sqrt(mean_squared_error(y_staff_test, y_staff_pred)):.4f}")
print(f"R²: {r2_score(y_staff_test, y_staff_pred):.4f}")

# Function to predict resource needs
def predict_resources(date, department, outpatient_visits, inpatient_admissions, avg_length_of_stay):
    # Prepare input data
    input_data = pd.DataFrame({
        'Month': [date.month],
        'Year': [date.year],
        'DayOfWeek': [date.dayofweek],
        'IsHoliday': [0],  # Assume not holiday
        'Department': [department],
        'OutpatientVisits': [outpatient_visits],
        'InpatientAdmissions': [inpatient_admissions],
        'StaffAvailable': [20],  # Placeholder
        'AvgLengthOfStay': [avg_length_of_stay],
        'Month_sin': [np.sin(2 * np.pi * date.month/12)],
        'Month_cos': [np.cos(2 * np.pi * date.month/12)],
        'DayOfWeek_sin': [np.sin(2 * np.pi * date.dayofweek/7)],
        'DayOfWeek_cos': [np.cos(2 * np.pi * date.dayofweek/7)]
    })
    
    # Predict
    bed_occupancy = bed_model.predict(input_data)[0]
    staff_needed = staff_model.predict(input_data)[0]
    
    return {
        'bed_occupancy_rate': bed_occupancy,
        'staff_needed': int(staff_needed)
    }

# Example prediction
prediction_date = pd.to_datetime('2023-05-15')
resources = predict_resources(
    date=prediction_date,
    department='Emergency',
    outpatient_visits=250,
    inpatient_admissions=45,
    avg_length_of_stay=3.5
)

print("\nPredicted Resources for May 15, 2023 (Emergency Department):")
print(f"Predicted Bed Occupancy Rate: {resources['bed_occupancy_rate']:.2f}")
print(f"Predicted Staff Needed: {resources['staff_needed']}")

bed_model_filename = 'resource_allocation_bed_model.pkl'
with open(bed_model_filename, 'wb') as file:
    pickle.dump(bed_model, file)
print(f"Bed occupancy model saved to {bed_model_filename}")

# Save the staff requirements model
staff_model_filename = 'resource_allocation_staff_model.pkl'
with open(staff_model_filename, 'wb') as file:
    pickle.dump(staff_model, file)
print(f"Staff requirements model saved to {staff_model_filename}")
