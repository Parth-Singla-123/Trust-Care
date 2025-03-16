# python/app.py
from flask import Flask, request, jsonify
import pickle
import pandas as pd
import numpy as np
from datetime import datetime

app = Flask(__name__)

import os

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

# Load models with absolute paths
with open(os.path.join(BASE_DIR, "models/patient_flow_model.pkl"), "rb") as f:
    patient_flow_model = pickle.load(f)

with open(os.path.join(BASE_DIR, "models/appointment_scheduling_model.pkl"), "rb") as f:
    appointment_scheduling_model = pickle.load(f)

with open(os.path.join(BASE_DIR, "models/resource_allocation_bed_model.pkl"), "rb") as f:
    resource_allocation_bed_model = pickle.load(f)

with open(os.path.join(BASE_DIR, "models/resource_allocation_staff_model.pkl"), "rb") as f:
    resource_allocation_staff_model = pickle.load(f)


@app.route('/api/predictwaitingtime', methods=['POST'])
def predict_waiting_time():
    try:
        data = request.json
        
        # Extract inputs
        hour = data['hour']
        day_of_week = data['dayOfWeek']
        month = data['month']
        queue_length = data['queueLength']
        service_time = data['serviceTime']  # Added missing required input
        patient_type = data['patientType']
        department = data['department']
        
        # Create feature vector with cyclic encoding
        input_data = {
            'Hour_sin': np.sin(2 * np.pi * hour/24),
            'Hour_cos': np.cos(2 * np.pi * hour/24),
            'DayOfWeek_sin': np.sin(2 * np.pi * day_of_week/7),
            'DayOfWeek_cos': np.cos(2 * np.pi * day_of_week/7),
            'Month_sin': np.sin(2 * np.pi * month/12),
            'Month_cos': np.cos(2 * np.pi * month/12),
            'IsHoliday': 0,  # Assume not holiday
            'QueueLength': queue_length,
            'ServiceTime': service_time  # Added missing required input
        }
        
        # Add one-hot encoded columns
        for pt in ['Emergency', 'Routine', 'Follow-up']:
            input_data[f'PatientType_{pt}'] = 1 if patient_type == pt else 0
            
        for dept in ['General', 'Cardiology', 'Orthopedics', 'Pediatrics', 'OB-GYN']:
            input_data[f'Department_{dept}'] = 1 if department == dept else 0
        
        # Create DataFrame
        input_df = pd.DataFrame([input_data])
        
        # Ensure all features are present
        features = patient_flow_model.feature_names_in_ if hasattr(patient_flow_model, 'feature_names_in_') else None
        
        if features is not None:
            for feature in features:
                if feature not in input_df.columns:
                    input_df[feature] = 0
            # Use only the features used in training
            input_df = input_df[features]
        
        # Make prediction
        waiting_time = float(patient_flow_model.predict(input_df)[0])
        
        return jsonify({
            'waitingTime': waiting_time
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500




@app.route('/api/scheduleappointment', methods=['POST'])
def schedule_appointment():
    data = request.json
    
    # Extract inputs
    patient_info = {
        'Age': data['age'],
        'Gender': data['gender'],
        'VisitType': data['visitType'],
        'Urgency': data['urgency'],
        'Department': data['department']
    }
    
    # Create DataFrame
    input_df = pd.DataFrame([patient_info])
    
    # Predict service time category
    service_category = appointment_scheduling_model.predict(input_df)[0]
    
    # Calculate priority score
    urgency_score = {'Low': 1, 'Medium': 2, 'High': 3}
    service_score = {'Short': 1, 'Medium': 2, 'Long': 3}
    priority = urgency_score[data['urgency']] * service_score[service_category]
    
    return jsonify({
        'serviceCategory': service_category,
        'priorityScore': priority
    })

@app.route('/api/predictresources', methods=['POST'])
def predict_resources():
    data = request.json
    
    # Parse date
    date = datetime.strptime(data['date'], '%Y-%m-%d')
    
    # Prepare input data
    input_data = pd.DataFrame({
        'Month': [date.month],
        'Year': [date.year],
        'DayOfWeek': [date.weekday()],
        'IsHoliday': [0],  # Assume not holiday
        'Department': [data['department']],
        'OutpatientVisits': [data['outpatientVisits']],
        'InpatientAdmissions': [data['inpatientAdmissions']],
        'StaffAvailable': [20],  # Placeholder
        'AvgLengthOfStay': [data['avgLengthOfStay']],
        'Month_sin': [np.sin(2 * np.pi * date.month/12)],
        'Month_cos': [np.cos(2 * np.pi * date.month/12)],
        'DayOfWeek_sin': [np.sin(2 * np.pi * date.weekday()/7)],
        'DayOfWeek_cos': [np.cos(2 * np.pi * date.weekday()/7)]
    })
    
    # Predict
    bed_occupancy = float(resource_allocation_bed_model.predict(input_data)[0])
    staff_needed = int(resource_allocation_staff_model.predict(input_data)[0])
    
    return jsonify({
        'bedOccupancyRate': bed_occupancy,
        'staffNeeded': staff_needed
    })

if __name__ == '__main__':
    app.run(port=5328)
