'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarHeart, User, AlertTriangle, BriefcaseMedical } from 'lucide-react';

export default function AppointmentScheduler() {
    const [inputs, setInputs] = useState({
        age: 45,
        gender: 'M',
        visitType: 'New',
        urgency: 'Medium',
        department: 'Cardiology'
    });

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/scheduleappointment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inputs),
            });

            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error('Error scheduling appointment:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            className="bg-gradient-to-br from-blue-100 to-blue-300 min-h-screen flex items-center justify-center p-6 font-sans"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {!result ? (
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="container mx-auto max-w-2xl bg-white shadow-lg rounded-xl p-8 border-2 border-blue-400"
                >
                    <h1 className="text-3xl font-extrabold text-blue-700 text-center mb-6">📅 Schedule Your Appointment</h1>
                    <p className="text-center text-gray-700 mb-8">
                        Fill in your details to schedule your next visit with ease.
                    </p>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-950">
                        
                        {/* Age Input */}
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            className="flex flex-col bg-blue-50 p-3 rounded-md shadow-sm"
                        >
                            <label className="text-sm font-semibold">🔢 Age</label>
                            <input
                                type="number"
                                name="age"
                                value={inputs.age}
                                onChange={handleChange}
                                min="1"
                                max="120"
                                className="p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            />
                        </motion.div>

                        {/* Gender Input */}
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            className="flex flex-col bg-indigo-50 p-3 rounded-md shadow-sm"
                        >
                            <label className="text-sm font-semibold">🚻 Gender</label>
                            <select
                                name="gender"
                                value={inputs.gender}
                                onChange={handleChange}
                                className="bg-transparent w-full focus:outline-none"
                                required
                            >
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                            </select>
                        </motion.div>

                        {/* Visit Type Input */}
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            className="flex flex-col bg-yellow-50 p-3 rounded-md shadow-sm"
                        >
                            <label className="text-sm font-semibold">🗓️ Visit Type</label>
                            <select
                                name="visitType"
                                value={inputs.visitType}
                                onChange={handleChange}
                                className="bg-transparent w-full focus:outline-none"
                                required
                            >
                                <option value="New">New</option>
                                <option value="Follow-up">Follow-up</option>
                            </select>
                        </motion.div>

                        {/* Urgency Input */}
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            className="flex flex-col bg-red-50 p-3 rounded-md shadow-sm"
                        >
                            <label className="text-sm font-semibold">⚠️ Urgency</label>
                            <select
                                name="urgency"
                                value={inputs.urgency}
                                onChange={handleChange}
                                className="bg-transparent w-full focus:outline-none"
                                required
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </motion.div>

                        {/* Department Input */}
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            className="flex flex-col bg-purple-50 p-3 rounded-md shadow-sm"
                        >
                            <label className="text-sm font-semibold">🏥 Department</label>
                            <select
                                name="department"
                                value={inputs.department}
                                onChange={handleChange}
                                className="bg-transparent w-full focus:outline-none"
                                required
                            >
                                <option value="Cardiology">Cardiology</option>
                                <option value="Orthopedics">Orthopedics</option>
                                <option value="Neurology">Neurology</option>
                                <option value="General">General</option>
                            </select>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md w-full 
                                       transform hover:scale-101 transition-all duration-150 col-span-2"
                            disabled={loading}
                            whileHover={{ scale: 1.05 }}
                        >
                            {loading ? 'Processing...' : 'Confirm Appointment'}
                        </motion.button>
                    </form>
                </motion.div>
            ) : (
                <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
                className="p-8 bg-gradient-to-br from-green-100 to-green-200 rounded-xl shadow-lg max-w-lg mx-auto text-center border-t-4 border-green-600"
            >
                {/* Checkmark Animation */}
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, type: 'spring', bounce: 0.5 }}
                    className="w-20 h-20 mx-auto mb-4 bg-green-500 text-white rounded-full flex items-center justify-center shadow-md"
                >
                    ✅
                </motion.div>

                {/* Confirmation Title */}
                <h2 className="text-4xl font-extrabold text-green-800 mb-2">Appointment Confirmed!</h2>
                
                {/* Details Section */}
                <div className="bg-white p-4 rounded-lg shadow-md border border-green-300 mt-4">
                    <p className="text-lg text-green-700">
                        <span className="font-semibold">Service Category:</span> 
                        <span className="font-medium"> {result.serviceCategory}</span>
                    </p>
                    <p className="text-lg text-green-700">
                        <span className="font-semibold">Priority Score:</span> 
                        <span className="font-medium"> {result.priorityScore}</span>
                    </p>
                </div>

                {/* Thank You Message */}
                <p className="italic text-sm text-green-600 mt-6">Thank you for choosing our service! We look forward to serving you.</p>

                {/* Back to Home Button */}
                <motion.a
                    href="/"
                    whileHover={{ scale: 1.05 }}
                    className="mt-6 inline-block px-5 py-2 text-white bg-green-500 rounded-md shadow-md 
                            hover:bg-green-600 transition-all duration-300"
                >
                    Back to Home
                </motion.a>
            </motion.div>

                        )}
        </motion.div>
    );
}
