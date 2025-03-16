import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import pickle

# Download and prepare dataset from NCBI
# Using the Hangu dataset which contains consultation service time with patient characteristics
url = "https://www.mdpi.com/2306-5729/8/3/47/s1"
# Note: This is a placeholder. In a real implementation, you would download the dataset from the URL

# For demonstration, we'll create a synthetic dataset based on the paper's description
np.random.seed(42)
n_samples = 1000

# Generate synthetic data based on the Hangu dataset description
data = {
    'PatientID': range(1, n_samples + 1),
    'Age': np.random.randint(18, 90, n_samples),
    'Gender': np.random.choice(['M', 'F'], n_samples),
    'VisitType': np.random.choice(['New', 'Follow-up'], n_samples),
    'Urgency': np.random.choice(['Low', 'Medium', 'High'], n_samples, p=[0.6, 0.3, 0.1]),
    'Department': np.random.choice(['Cardiology', 'Orthopedics', 'Neurology', 'General'], n_samples),
    'ServiceTime': np.random.gamma(shape=2, scale=10, size=n_samples),  # Service time in minutes
    'DoctorID': np.random.randint(1, 21, n_samples)  # 20 doctors
}

df = pd.DataFrame(data)

# Add some correlation between urgency and service time
df.loc[df['Urgency'] == 'High', 'ServiceTime'] += 15
df.loc[df['Urgency'] == 'Medium', 'ServiceTime'] += 5

# Feature engineering
X = df.drop(['PatientID', 'ServiceTime', 'DoctorID'], axis=1)
y = pd.cut(df['ServiceTime'], bins=[0, 10, 20, 100], labels=['Short', 'Medium', 'Long'])

# Preprocessing pipeline
categorical_features = ['Gender', 'VisitType', 'Urgency', 'Department']
numeric_features = ['Age']

categorical_transformer = OneHotEncoder(handle_unknown='ignore')
numeric_transformer = StandardScaler()

preprocessor = ColumnTransformer(
    transformers=[
        ('num', numeric_transformer, numeric_features),
        ('cat', categorical_transformer, categorical_features)
    ])

# Create and train the model
model = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
])

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the model
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))

# Function to match doctors with patients
def match_doctor_patient(patient_info, available_doctors, doctor_specialties):
    # Predict service time category
    service_category = model.predict(pd.DataFrame([patient_info]))[0]
    
    # Calculate priority score based on urgency and predicted service time
    urgency_score = {'Low': 1, 'Medium': 2, 'High': 3}
    service_score = {'Short': 1, 'Medium': 2, 'Long': 3}
    
    priority = urgency_score[patient_info['Urgency']] * service_score[service_category]
    
    # Match with appropriate doctor based on specialty and availability
    suitable_doctors = [d for d in available_doctors if doctor_specialties[d] == patient_info['Department']]
    
    if suitable_doctors:
        # Sort by doctor efficiency (could be based on historical data)
        return suitable_doctors[0], priority
    else:
        # Return any available doctor if no specialty match
        return available_doctors[0] if available_doctors else None, priority

# Example usage
patient = {
    'Age': 65,
    'Gender': 'M',
    'VisitType': 'New',
    'Urgency': 'High',
    'Department': 'Cardiology'
}

available_doctors = [3, 7, 12, 15]
doctor_specialties = {3: 'Cardiology', 7: 'Orthopedics', 12: 'Cardiology', 15: 'Neurology'}

assigned_doctor, priority = match_doctor_patient(patient, available_doctors, doctor_specialties)
print(f"\nPatient assigned to Doctor {assigned_doctor} with priority score {priority}")


# Save the trained model to a pickle file
model_filename = 'appointment_scheduling_model.pkl'

# Save the model to disk
with open(model_filename, 'wb') as file:
    pickle.dump(model, file)

print(f"Model saved to {model_filename}")

