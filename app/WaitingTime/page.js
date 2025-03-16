'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, User, CalendarDays, AlertTriangle, BriefcaseMedical } from 'lucide-react';

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
            const response = await fetch('/api/predictwaitingtime', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inputs),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            setWaitingTime(data.waitingTime ?? 'N/A');
        } catch (error) {
            setError(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-200 p-8 font-sans">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl w-full bg-white shadow-lg rounded-xl p-6"
            >
                <h1 className="text-3xl font-extrabold text-blue-800 text-center mb-4">
                    Waiting Time Predictor
                </h1>
                <p className="text-center text-gray-600 mb-8">
                    Our intelligent system predicts your estimated waiting time based on key inputs.
                </p>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-blue-950">
                    
                    {/* Hour Input */}
                    <div className="bg-blue-50 p-3 rounded-md shadow-sm">
                        <label className="block text-sm font-bold text-blue-700 mb-1">Hour</label>
                        <div className="flex items-center space-x-3">
                            <Clock className="w-6 h-6 text-blue-600" />
                            <select
                                name="hour"
                                value={inputs.hour}
                                onChange={handleChange}
                                className="bg-transparent w-full focus:outline-none"
                                required
                            >
                                {Array.from({ length: 24 }, (_, i) => (
                                    <option key={i} value={i}>{i}:00</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Month Input */}
                    <div className="bg-purple-50 p-3 rounded-md shadow-sm">
                        <label className="block text-sm font-bold text-purple-700 mb-1">Month</label>
                        <div className="flex items-center space-x-3">
                            <CalendarDays className="w-6 h-6 text-purple-600" />
                            <select
                                name="month"
                                value={inputs.month}
                                onChange={handleChange}
                                className="bg-transparent w-full focus:outline-none"
                                required
                            >
                                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, i) => (
                                    <option key={i} value={i + 1}>{month}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Day of the Week */}
                    <div className="bg-violet-50 p-3 rounded-md shadow-sm">
                        <label className="block text-sm font-bold text-violet-700 mb-1">Day of the Week</label>
                        <div className="flex items-center space-x-3">
                            <CalendarDays className="w-6 h-6 text-violet-600" />
                            <select
                                name="dayOfWeek"
                                value={inputs.dayOfWeek}
                                onChange={handleChange}
                                className="bg-transparent w-full focus:outline-none"
                                required
                            >
                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, i) => (
                                    <option key={i} value={i + 1}>{day}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Queue Length */}
                    <div className="bg-yellow-50 p-3 rounded-md shadow-sm">
                        <label className="block text-sm font-bold text-yellow-700 mb-1">Queue Length</label>
                        <div className="flex items-center space-x-3">
                            <AlertTriangle className="w-6 h-6 text-yellow-600" />
                            <input
                                type="number"
                                name="queueLength"
                                value={inputs.queueLength}
                                onChange={handleChange}
                                min="0"
                                max="25"
                                className="bg-transparent w-full focus:outline-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Service Time */}
                    <div className="bg-pink-50 p-3 rounded-md shadow-sm">
                        <label className="block text-sm font-bold text-pink-700 mb-1">Service Time</label>
                        <div className="flex items-center space-x-3">
                            <Clock className="w-6 h-6 text-pink-600" />
                            <input
                                type="number"
                                name="serviceTime"
                                value={inputs.serviceTime}
                                onChange={handleChange}
                                min="1"
                                max="35"
                                className="bg-transparent w-full focus:outline-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Patient Type */}
                    <div className="bg-red-50 p-3 rounded-md shadow-sm">
                        <label className="block text-sm font-bold text-red-700 mb-1">Patient Type</label>
                        <div className="flex items-center space-x-3">
                            <User className="w-6 h-6 text-red-600" />
                            <select
                                name="patientType"
                                value={inputs.patientType}
                                onChange={handleChange}
                                className="bg-transparent w-full focus:outline-none"
                                required
                            >
                                <option value="Routine">Routine</option>
                                <option value="Emergency">Emergency</option>
                                <option value="Follow-up">Follow-up</option>
                            </select>
                        </div>
                    </div>

                    {/* Department */}
                    <div className="bg-gray-50 p-3 rounded-md shadow-sm">
                        <label className="block text-sm font-bold text-gray-700 mb-1">Department</label>
                        <div className="flex items-center space-x-3">
                            <BriefcaseMedical className="w-6 h-6 text-gray-600" />
                            <select
                                name="department"
                                value={inputs.department}
                                onChange={handleChange}
                                className="bg-transparent w-full focus:outline-none"
                                required
                            >
                                <option value="General">General</option>
                                <option value="Cardiology">Cardiology</option>
                                <option value="Orthopedics">Orthopedics</option>
                                <option value="Pediatrics">Pediatrics</option>
                                <option value="OB-GYN">OB-GYN</option>
                            </select>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md transform hover:scale-105 transition-all duration-300 w-full"
                        disabled={loading}
                    >
                        {loading ? 'Predicting...' : 'Predict Waiting Time'}
                    </button>
                </form>
                {/* Results and Error */}
                {waitingTime && (
                    <div className="mt-8 text-center text-xl font-bold text-blue-800">
                        Estimated Waiting Time: {waitingTime.toFixed(1)} minutes
                    </div>
                )}
                {error && (
                    <div className="mt-4 p-3 bg-red-100 rounded text-red-700">
                        <p className="font-bold">Error:</p>
                        <p>{error}</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
