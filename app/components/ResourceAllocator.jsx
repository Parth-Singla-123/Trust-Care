// app/components/ResourceAllocator.jsx
'use client';
import { useState } from 'react';

export default function ResourceAllocator() {
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
        <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-bold mb-4">Resource Allocation Predictor</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1">Date</label>
                    <input
                        type="date"
                        name="date"
                        value={inputs.date}
                        onChange={handleChange}
                        className="border p-2 w-full"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1">Department</label>
                    <select
                        name="department"
                        value={inputs.department}
                        onChange={handleChange}
                        className="border p-2 w-full"
                        required
                    >
                        <option value="Emergency">Emergency</option>
                        <option value="Surgery">Surgery</option>
                        <option value="Internal Medicine">Internal Medicine</option>
                        <option value="Pediatrics">Pediatrics</option>
                        <option value="Obstetrics">Obstetrics</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-1">Expected Outpatient Visits</label>
                    <input
                        type="number"
                        name="outpatientVisits"
                        value={inputs.outpatientVisits}
                        onChange={handleChange}
                        min="0"
                        className="border p-2 w-full"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1">Expected Inpatient Admissions</label>
                    <input
                        type="number"
                        name="inpatientAdmissions"
                        value={inputs.inpatientAdmissions}
                        onChange={handleChange}
                        min="0"
                        className="border p-2 w-full"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1">Average Length of Stay (days)</label>
                    <input
                        type="number"
                        name="avgLengthOfStay"
                        value={inputs.avgLengthOfStay}
                        onChange={handleChange}
                        min="0.1"
                        step="0.1"
                        className="border p-2 w-full"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    disabled={loading}
                >
                    {loading ? 'Calculating...' : 'Predict Resource Needs'}
                </button>
            </form>

            {resources && (
                <div className="mt-4 p-3 bg-green-100 rounded">
                    <p className="font-bold text-black">Predicted Resource Needs:</p>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="p-3 bg-blue-50 rounded">
                            <p className="text-sm text-blue-700">Bed Occupancy Rate</p>
                            <p className="text-2xl text-black">{(resources.bedOccupancyRate * 100).toFixed(1)}%</p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded">
                            <p className="text-sm text-purple-700">Staff Needed</p>
                            <p className="text-2xl text-black">{resources.staffNeeded}</p>
                        </div>
                    </div>

                    {resources.bedOccupancyRate > 0.85 && (
                        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                            <p>⚠️ Warning: High bed occupancy predicted. Consider additional resource allocation.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
