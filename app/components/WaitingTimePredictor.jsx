'use client';
import { useState } from 'react';

export default function WaitingTimePredictor() {
  const [inputs, setInputs] = useState({
    hour: 14,
    dayOfWeek: 2,
    month: 3,
    queueLength: 5,
    serviceTime: 10,
    patientType: 'Routine',
    department: 'General'
  });
  const [waitingTime, setWaitingTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Make sure dayOfWeek is 0-indexed (0-6) as the model expects
      const adjustedInputs = {
        ...inputs,
        dayOfWeek: parseInt(inputs.dayOfWeek), // Convert 1-7 to 0-6
      };
      
      const response = await fetch('/api/predictwaitingtime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adjustedInputs),
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.waitingTime !== undefined && data.waitingTime !== null) {
        setWaitingTime(data.waitingTime);
      } else {
        setError('Received invalid response from server');
      }
    } catch (error) {
      console.error('Error predicting waiting time:', error);
      setError(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Predict Waiting Time</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Hour Input */}
        <div>
          <label className="block mb-1">Hour (0-23)</label>
          <select
            name="hour"
            value={inputs.hour}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>{i}:00</option>
            ))}
          </select>
        </div>

        {/* Day of Week Input */}
        <div>
          <label className="block mb-1">Day of the Week</label>
          <select
            name="dayOfWeek"
            value={inputs.dayOfWeek}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          >
            <option value="1">Monday</option>
            <option value="2">Tuesday</option>
            <option value="3">Wednesday</option>
            <option value="4">Thursday</option>
            <option value="5">Friday</option>
            <option value="6">Saturday</option>
            <option value="7">Sunday</option>
          </select>
        </div>

        {/* Month Input */}
        <div>
          <label className="block mb-1">Month</label>
          <select
            name="month"
            value={inputs.month}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          >
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </div>

        {/* Queue Length Input */}
        <div>
          <label className="block mb-1">Queue Length</label>
          <input
            type="number"
            name="queueLength"
            value={inputs.queueLength}
            onChange={handleChange}
            min="0"
            max="25"
            className="border p-2 w-full"
            required
          />
        </div>

        {/* Service Time Input */}
        <div>
          <label className="block mb-1">Service Time (minutes)</label>
          <input
            type="number"
            name="serviceTime"
            value={inputs.serviceTime}
            onChange={handleChange}
            min="1"
            max="35"
            step="0.5"
            className="border p-2 w-full"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Average time spent with doctor</p>
        </div>

        {/* Patient Type Selection */}
        <div>
          <label className="block mb-1">Patient Type</label>
          <select
            name="patientType"
            value={inputs.patientType}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          >
            <option value="Routine">Routine</option>
            <option value="Emergency">Emergency</option>
            <option value="Follow-up">Follow-up</option>
          </select>
        </div>

        {/* Department Selection */}
        <div>
          <label className="block mb-1">Department</label>
          <select
            name="department"
            value={inputs.department}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          >
            <option value="General">General</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="OB-GYN">OB-GYN</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Predicting...' : 'Predict Waiting Time'}
        </button>
      </form>
      
      {/* Display Result */}
      {waitingTime !== null && (
        <div className="mt-4 p-3 bg-green-100 rounded text-black">
          <p className="font-bold">Estimated Waiting Time:</p>
          <p className="text-2xl text-black">
            {waitingTime.toFixed(1)} minutes
          </p>
        </div>
      )}
      
      {/* Display Error */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 rounded text-red-700">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
