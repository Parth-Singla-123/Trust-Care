'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, BriefcaseMedical, Users, BedDouble, Activity } from 'lucide-react';

export default function ResourceAllocatorPage() {
    const [inputs, setInputs] = useState({
        date: new Date().toISOString().split('T')[0],
        department: 'Emergency',
        outpatientVisits: 250,
        inpatientAdmissions: 45,
        avgLengthOfStay: 3.5
    });

    const [resources, setResources] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/predictresources', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputs),
            });

            const data = await response.json();
            setResources(data);
        } catch (error) {
            console.error('Error predicting resources:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-100 to-blue-200 p-8 mt-3 font-sans">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-3xl"
            >
                <h2 className="text-3xl font-extrabold text-blue-700 text-center mb-6">
                    🏥 Smart Resource Allocation
                </h2>

                <p className="text-center text-gray-600 mb-8">
                    Enter the details to predict optimal resource needs for your department.
                </p>

                {/* Form with Grid Layout */}
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 text-blue-950">

                    {/* Date Input */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-col space-y-1 bg-blue-50 p-3 rounded-md shadow-sm"
                    >
                        <label className="text-sm font-semibold text-blue-600">📅 Date</label>
                        <div className="flex items-center space-x-3">
                            <CalendarDays className="w-6 h-6 text-blue-600" />
                            <input
                                type="date"
                                name="date"
                                value={inputs.date}
                                onChange={handleChange}
                                className="bg-transparent w-full focus:outline-none"
                                required
                            />
                        </div>
                    </motion.div>

                    {/* Department Input */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col space-y-1 bg-gray-50 p-3 rounded-md shadow-sm"
                    >
                        <label className="text-sm font-semibold text-gray-600">🏢 Department</label>
                        <div className="flex items-center space-x-3">
                            <BriefcaseMedical className="w-6 h-6 text-gray-600" />
                            <select
                                name="department"
                                value={inputs.department}
                                onChange={handleChange}
                                className="bg-transparent w-full focus:outline-none"
                                required
                            >
                                <option value="Emergency">Emergency</option>
                                <option value="Surgery">Surgery</option>
                                <option value="Internal Medicine">Internal Medicine</option>
                                <option value="Pediatrics">Pediatrics</option>
                                <option value="Obstetrics">Obstetrics</option>
                            </select>
                        </div>
                    </motion.div>

                    {/* Outpatient Visits Input */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col space-y-1 bg-yellow-50 p-3 rounded-md shadow-sm"
                    >
                        <label className="text-sm font-semibold text-yellow-600">👥 Outpatient Visits</label>
                        <input
                            type="number"
                            name="outpatientVisits"
                            value={inputs.outpatientVisits}
                            onChange={handleChange}
                            min="0"
                            className="bg-transparent w-full focus:outline-none"
                            required
                            placeholder="e.g., 250"
                        />
                    </motion.div>

                    {/* Inpatient Admissions Input */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col space-y-1 bg-pink-50 p-3 rounded-md shadow-sm"
                    >
                        <label className="text-sm font-semibold text-pink-600">🏨 Inpatient Admissions</label>
                        <input
                            type="number"
                            name="inpatientAdmissions"
                            value={inputs.inpatientAdmissions}
                            onChange={handleChange}
                            min="0"
                            className="bg-transparent w-full focus:outline-none"
                            required
                            placeholder="e.g., 45"
                        />
                    </motion.div>

                    {/* Average Length of Stay Input */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col space-y-1 bg-purple-50 p-3 rounded-md shadow-sm"
                    >
                        <label className="text-sm font-semibold text-purple-600">📊 Avg. Length of Stay (days)</label>
                        <input
                            type="number"
                            name="avgLengthOfStay"
                            value={inputs.avgLengthOfStay}
                            onChange={handleChange}
                            min="0.1"
                            step="0.1"
                            className="bg-transparent w-full focus:outline-none"
                            required
                            placeholder="e.g., 3.5"
                        />
                    </motion.div>

                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md w-full 
                        transform hover:scale-101 transition-all duration-150 col-span-2"
                        disabled={loading}
                        whileHover={{ scale: 1.01 }}
                    >
                        {loading ? 'Calculating...' : 'Predict Resource Needs'}
                    </motion.button>
                </form>

                {/* Results */}
                {resources && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-3 p-4 bg-green-100 rounded-md text-center"
                    >
                        <p className="text-lg font-bold text-black">🔍 Final Resource Summary</p>
                        <div className="grid grid-cols-2 gap-4 mt-1">
                            <div className="p-3 bg-blue-50 rounded-md">
                                <p className="text-sm text-blue-700">Bed Occupancy Rate</p>
                                <p className="text-2xl text-black">
                                    {(resources.bedOccupancyRate * 100).toFixed(1)}%
                                </p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-md">
                                <p className="text-sm text-purple-700">Staff Needed</p>
                                <p className="text-2xl text-black">{resources.staffNeeded}</p>
                            </div>
                        </div>
                        {resources.bedOccupancyRate > 0.85 && (
                            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                                <p>⚠️ Warning: High bed occupancy predicted. Consider additional resource allocation.</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
