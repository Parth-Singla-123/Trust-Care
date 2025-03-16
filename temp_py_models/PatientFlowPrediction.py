import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
import matplotlib.pyplot as plt
from datetime import datetime, timedelta
import pickle

# Create synthetic dataset based on real hospital patterns from research papers
np.random.seed(42)
n_samples = 2000  # Increased sample size for better generalization

# Generate dates spanning a year with more granular time intervals
start_date = datetime(2024, 1, 1)
dates = [start_date + timedelta(hours=i*2) for i in range(n_samples)]

# Generate synthetic data based on patterns described in research papers
data = {
    'ArrivalTime': dates,
    'DayOfWeek': [d.weekday() for d in dates],
    'Hour': [d.hour for d in dates],
    'Month': [d.month for d in dates],
    'IsHoliday': np.random.choice([0, 1], n_samples, p=[0.95, 0.05]),
    'PatientType': np.random.choice(['Emergency', 'Routine', 'Follow-up'], n_samples, p=[0.3, 0.5, 0.2]),
    'Department': np.random.choice(['General', 'Cardiology', 'Orthopedics', 'Pediatrics', 'OB-GYN'], n_samples),
    'QueueLength': np.zeros(n_samples),
    'ServiceTime': np.zeros(n_samples)
}

# Create realistic queue lengths based on time patterns and research findings
for i in range(n_samples):
    base_queue = 3  # Base queue length
    
    # Add time-of-day effect (based on hospital traffic patterns)
    hour = data['Hour'][i]
    if 8 <= hour <= 11:  # Morning rush (based on research showing peak morning hours)
        base_queue += 6
    elif 13 <= hour <= 16:  # Afternoon rush
        base_queue += 5
    elif 17 <= hour <= 19:  # Evening moderate
        base_queue += 3
    elif 0 <= hour <= 5:  # Night hours (reduced traffic)
        base_queue -= 2
    
    # Add day-of-week effect (based on research showing Monday and Friday peaks)
    day = data['DayOfWeek'][i]
    if day == 0:  # Monday
        base_queue += 4
    elif day == 4:  # Friday
        base_queue += 3
    elif day == 6:  # Sunday
        base_queue -= 1
    
    # Add seasonal effect (based on research showing winter months have higher hospital visits)
    month = data['Month'][i]
    if month in [1, 2, 12]:  # Winter months
        base_queue += 2
    elif month in [6, 7, 8]:  # Summer months
        base_queue -= 1
    
    # Add holiday effect
    if data['IsHoliday'][i] == 1:
        base_queue += 3
    
    # Add randomness with realistic constraints
    base_queue = max(1, base_queue)  
    data['QueueLength'][i] = max(0, int(np.random.poisson(base_queue)))
    
    # Generate service time (time with doctor) based on patient type
    if data['PatientType'][i] == 'Emergency':
        service_time = np.random.gamma(shape=3, scale=5)  # Higher variability for emergencies
    elif data['PatientType'][i] == 'Follow-up':
        service_time = np.random.gamma(shape=2, scale=3)  # More predictable for follow-ups
    else:  # Routine
        service_time = np.random.gamma(shape=2.5, scale=4)
        
    data['ServiceTime'][i] = service_time

# Generate waiting times based on queue length, patient type, and other factors
data['WaitingTime'] = np.zeros(n_samples)
for i in range(n_samples):
    # Base waiting time proportional to queue length and service time
    base_wait = data['QueueLength'][i] * 7  # 7 minutes per person in queue
    
    # Adjust for patient type (based on triage principles)
    if data['PatientType'][i] == 'Emergency':
        base_wait *= 0.4  # Emergency patients get higher priority
    elif data['PatientType'][i] == 'Follow-up':
        base_wait *= 0.75  # Follow-ups are usually faster
    
    # Add department effect (some departments have longer wait times)
    if data['Department'][i] == 'Cardiology':
        base_wait *= 1.2
    elif data['Department'][i] == 'Orthopedics':
        base_wait *= 1.1
    
    # Add time-of-day effect on efficiency
    hour = data['Hour'][i]
    if 0 <= hour <= 5:  # Night shift (less staff)
        base_wait *= 1.3
    
    # Add randomness to represent variability in service time
    data['WaitingTime'][i] = max(0, base_wait + np.random.normal(0, 8))

# Create DataFrame
df = pd.DataFrame(data)

# Additional feature engineering based on research
df['Hour_sin'] = np.sin(2 * np.pi * df['Hour']/24)
df['Hour_cos'] = np.cos(2 * np.pi * df['Hour']/24)
df['DayOfWeek_sin'] = np.sin(2 * np.pi * df['DayOfWeek']/7)
df['DayOfWeek_cos'] = np.cos(2 * np.pi * df['DayOfWeek']/7)
df['Month_sin'] = np.sin(2 * np.pi * df['Month']/12)
df['Month_cos'] = np.cos(2 * np.pi * df['Month']/12)

# Add time-based features that research shows are important
df['IsWeekend'] = df['DayOfWeek'].apply(lambda x: 1 if x >= 5 else 0)
df['TimeOfDay'] = df['Hour'].apply(lambda x: 
                                  'Night' if 0 <= x < 6 else
                                  'Morning' if 6 <= x < 12 else
                                  'Afternoon' if 12 <= x < 18 else 'Evening')

# One-hot encode categorical variables
df = pd.get_dummies(df, columns=['PatientType', 'Department', 'TimeOfDay'], drop_first=False)

# Prepare features and target
features = ['Hour_sin', 'Hour_cos', 'DayOfWeek_sin', 'DayOfWeek_cos', 
            'Month_sin', 'Month_cos', 'IsHoliday', 'IsWeekend', 'QueueLength', 'ServiceTime'] + \
           [col for col in df.columns if col.startswith('PatientType_') or 
                                         col.startswith('Department_') or
                                         col.startswith('TimeOfDay_')]
X = df[features]
y = df['WaitingTime']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create a pipeline with preprocessing and model
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('model', GradientBoostingRegressor(random_state=42))
])

# Train model with optimized hyperparameters based on research findings
params = {
    'model__n_estimators': 200,
    'model__max_depth': 5,
    'model__learning_rate': 0.1,
    'model__min_samples_split': 5,
    'model__min_samples_leaf': 2
}

pipeline.set_params(**params)
pipeline.fit(X_train, y_train)

# Evaluate model
y_pred = pipeline.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"Mean Squared Error: {mse:.2f}")
print(f"Root Mean Squared Error: {rmse:.2f}")
print(f"Mean Absolute Error: {mae:.2f}")
print(f"R² Score: {r2:.2f}")

# Feature importance
if hasattr(pipeline['model'], 'feature_importances_'):
    feature_importance = pd.DataFrame({
        'Feature': features,
        'Importance': pipeline['model'].feature_importances_
    }).sort_values('Importance', ascending=False)

    print("\nTop 10 Feature Importance:")
    print(feature_importance.head(10))

# Predict waiting time for new patients
def predict_waiting_time(hour, day_of_week, month, queue_length, service_time, patient_type, department):
    # Create feature vector with cyclic encoding
    input_data = {
        'Hour_sin': np.sin(2 * np.pi * hour/24),
        'Hour_cos': np.cos(2 * np.pi * hour/24),
        'DayOfWeek_sin': np.sin(2 * np.pi * day_of_week/7),
        'DayOfWeek_cos': np.cos(2 * np.pi * day_of_week/7),
        'Month_sin': np.sin(2 * np.pi * month/12),
        'Month_cos': np.cos(2 * np.pi * month/12),
        'IsHoliday': 0,  # Assume not holiday
        'IsWeekend': 1 if day_of_week >= 5 else 0,
        'QueueLength': queue_length,
        'ServiceTime': service_time
    }
    
    # Add time of day
    time_of_day = 'Night' if 0 <= hour < 6 else 'Morning' if 6 <= hour < 12 else 'Afternoon' if 12 <= hour < 18 else 'Evening'
    for tod in ['Night', 'Morning', 'Afternoon', 'Evening']:
        input_data[f'TimeOfDay_{tod}'] = 1 if time_of_day == tod else 0
    
    # Add one-hot encoded columns
    for pt in ['Emergency', 'Routine', 'Follow-up']:
        input_data[f'PatientType_{pt}'] = 1 if patient_type == pt else 0
        
    for dept in ['General', 'Cardiology', 'Orthopedics', 'Pediatrics', 'OB-GYN']:
        input_data[f'Department_{dept}'] = 1 if department == dept else 0
    
    # Create DataFrame
    input_df = pd.DataFrame([input_data])
    
    # Ensure all features are present
    for feature in features:
        if feature not in input_df.columns:
            input_df[feature] = 0
    
    # Use only the features used in training
    input_features = input_df[features]
    
    return pipeline.predict(input_features)[0]

# Example prediction
current_hour = 14  # 2 PM
current_day = 2    # Wednesday (0-indexed, so 2 = Wednesday)
current_month = 3  # March
queue_length = 5
service_time = 10  # Average service time in minutes
patient_type = 'Routine'
department = 'General'

predicted_wait = predict_waiting_time(
    current_hour, current_day, current_month, 
    queue_length, service_time, patient_type, department
)

print(f"\nPredicted waiting time for a {patient_type} patient in {department} department")
print(f"Time: {current_hour}:00, Day: {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][current_day]}, Month: {current_month}")
print(f"Current queue length: {queue_length}")
print(f"Estimated waiting time: {predicted_wait:.1f} minutes")

# Plot actual vs predicted waiting times
plt.figure(figsize=(10, 6))
plt.scatter(y_test, y_pred, alpha=0.5)
plt.plot([0, max(y_test)], [0, max(y_test)], 'r--')
plt.xlabel('Actual Waiting Time (minutes)')
plt.ylabel('Predicted Waiting Time (minutes)')
plt.title('Actual vs Predicted Waiting Times')
plt.savefig('improved_waiting_time_prediction.png')
plt.close()

# Plot feature importance
if hasattr(pipeline['model'], 'feature_importances_'):
    plt.figure(figsize=(12, 8))
    plt.barh(feature_importance['Feature'].head(15), feature_importance['Importance'].head(15))
    plt.xlabel('Importance')
    plt.title('Top 15 Features by Importance')
    plt.gca().invert_yaxis()
    plt.tight_layout()
    plt.savefig('improved_feature_importance.png')
    plt.close()

# Save the model to disk
model_filename = 'patient_flow_model.pkl'
with open(model_filename, 'wb') as file:
    pickle.dump(pipeline, file)

print(f"Model saved to {model_filename}")
