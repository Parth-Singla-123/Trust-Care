'use client';
import { useState } from 'react';

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
                headers: {
                    'Content-Type': 'application/json',
                },
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
        <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-bold mb-4">Appointment Scheduler</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1">Age</label>
                    <input
                        type="number"
                        name="age"
                        value={inputs.age}
                        onChange={handleChange}
                        min="1"
                        max="120"
                        className="border p-2 w-full"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1">Gender</label>
                    <select
                        name="gender"
                        value={inputs.gender}
                        onChange={handleChange}
                        className="border p-2 w-full"
                        required
                    >
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-1">Visit Type</label>
                    <select
                        name="visitType"
                        value={inputs.visitType}
                        onChange={handleChange}
                        className="border p-2 w-full"
                        required
                    >
                        <option value="New">New</option>
                        <option value="Follow-up">Follow-up</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-1">Urgency</label>
                    <select
                        name="urgency"
                        value={inputs.urgency}
                        onChange={handleChange}
                        className="border p-2 w-full"
                        required
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
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
                        <option value="Cardiology">Cardiology</option>
                        <option value="Orthopedics">Orthopedics</option>
                        <option value="Neurology">Neurology</option>
                        <option value="General">General</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Schedule Appointment'}
                </button>
            </form>

            {result && (
                <div className="mt-4 p-3 bg-green-100 rounded text-black">
                    <p className="font-bold">Appointment Details:</p>
                    <p>Service Category: <span className="font-medium">{result.serviceCategory}</span></p>
                    <p>Priority Score: <span className="font-medium">{result.priorityScore}</span></p>
                    <div className="mt-2 p-2 bg-yellow-50 rounded text-sm">
                        <p className="italic">Higher priority score means more urgent case</p>
                    </div>
                </div>
            )}
        </div>
    );
}
