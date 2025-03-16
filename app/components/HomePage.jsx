import Link from 'next/link';
import React from 'react';

function HomePage() {
    return (
        <div className="bg-gradient-to-r from-blue-100 to-blue-200 min-h-screen pt-20">
            {/* Hero Section */}
            <div className="container mx-auto flex flex-col md:flex-row items-center px-6 py-16">
                <div className="text-center md:text-left md:w-1/2 mx-auto px-7">
                    <h1 className="text-5xl font-extrabold text-blue-800 leading-tight mb-6">
                        Your Health, <span className="text-indigo-900">Our Priority</span>
                    </h1>
                    <p className="text-lg text-gray-700 mb-6">
                        Experience professional healthcare services from the comfort of your home. Get expert consultation, personalized care, and the latest medical insights all in one place.
                    </p>
                    <button className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition text-lg font-semibold">
                        Get Started
                    </button>
                </div>
                <div className="md:w-1/2 mt-10 md:mt-0">
                    <img src="/image.png" alt="Healthcare Hero" className="w-3/5 rounded-2xl shadow-xl mx-auto" />
                </div>
            </div>

            {/* Services Section */}
            <div className="bg-white py-16">
                <div className="container mx-auto text-center">
                    <h2 className="text-4xl font-bold text-blue-800 mb-10">What we Provide at Trust+Care</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-5">

                        {/* Appointments Section */}
                        <div className="p-6 bg-blue-50 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-2 transition-all duration-300">
                            <h3 className="text-2xl font-semibold text-blue-700">Appointment Scheduling</h3>
                            <p className="mt-2 text-gray-600">
                                A data-driven system that analyzes past scheduling patterns, patient flow, and consultation durations to suggest optimized appointment slots. 
                                This minimizes scheduling conflicts and reduces idle time for both doctors and patients.
                            </p>
                            <Link href="/Appointments" className="text-indigo-900 mt-4 inline-block hover:text-blue-700 font-semibold text-lg">
                                Book Your Appointment Now →
                            </Link>
                        </div>

                        {/* Waiting Time Predictor Section */}
                        <div className="p-6 bg-blue-50 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-2 transition-all duration-300">
                            <h3 className="text-2xl font-semibold text-blue-700">Waiting Time Predictor</h3>
                            <p className="mt-2 text-gray-600">
                                Uses real-time data from patient check-ins, consultation durations, and staff availability to estimate waiting times.  
                                The system adapts dynamically throughout the day to reflect changing conditions in the hospital or clinic.
                            </p>
                            <Link href="/WaitingTime" className="text-indigo-900 mt-4 inline-block hover:text-blue-700 font-semibold text-lg">
                                Check Your Waiting →
                            </Link>
                        </div>

                        {/* Resource Allocation Section */}
                        <div className="p-6 bg-blue-50 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-2 transition-all duration-300">
                            <h3 className="text-2xl font-semibold text-blue-700">Resource Allocation</h3>
                            <p className="mt-2 text-gray-600">
                                Analyzes patient admissions, outpatient visits, and average length of stay to predict resource requirements.  
                                It calculates optimal staff levels, equipment needs, and bed occupancy rates to ensure smooth hospital operations.
                            </p>
                            <Link href="/ResourceAllocator" className="text-indigo-900 mt-4 inline-block hover:text-blue-700 font-semibold text-lg">
                                Manage Resources →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
