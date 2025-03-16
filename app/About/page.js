import React from 'react';
import { Lightbulb, Heart, Award } from 'lucide-react';
import Image from 'next/image';

function AboutUs() {
    return (
        <div className="bg-gradient-to-r from-blue-100 to-blue-200 min-h-screen pt-20 font-sans">
            <div className="container mx-auto px-6 py-6">
                <h1 className="text-5xl font-extrabold text-blue-800 text-center mb-10">About <span className="text-gray-700"> Trust<span className="text-green-900">+</span>Care </span></h1>
                
                {/* Introduction Section */}
                <div className="bg-white rounded-xl shadow-lg p-10 mb-16 flex flex-col md:flex-row items-center gap-8 animate-fadeIn mt-4">
                    <div className="md:w-1/2">
                        <Image src="/doctors.png" alt="Trust+Care Team" width={350} height={250} className="rounded-xl shadow-lg mx-auto" />
                    </div>
                    <div className="md:w-1/2 text-center md:text-left">
                        <h2 className="text-3xl font-bold text-blue-700 mb-4">Who We Are</h2>
                        <p className="text-gray-700 leading-relaxed text-lg">
                            Founded in 2020, Trust+Care is a Bangalore-based healthcare startup driven by innovation and compassion. Our AI-powered solutions improve healthcare outcomes globally by optimizing appointment scheduling, predicting waiting times, and enhancing resource allocation.
                        </p>
                    </div>
                </div>
                
                {/* Journey Section */}
                <div className="flex flex-col md:flex-row items-center mb-16 animate-slideIn">
                    <div className="md:w-1/2 text-center md:text-left">
                        <h2 className="text-3xl font-bold text-blue-700 mb-4">Our Journey</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Starting as a small healthcare startup, our initial goal was to reduce patient waiting times. Over the years, we developed AI-driven models for appointment scheduling, waiting time prediction, and efficient resource allocation — solutions now trusted by hospitals and clinics worldwide.
                        </p>
                    </div>
                    <div className="md:w-1/2 mt-10 md:mt-0">
                        <Image src="/journey.png" alt="Our Journey" width={350} height={250} className="w-4/5 rounded-2xl shadow-xl mx-auto" />
                    </div>
                </div>

                {/* Core Values Section */}
                <div className="bg-white py-12 rounded-lg shadow-md mb-16">
                    <h2 className="text-4xl font-bold text-blue-800 text-center mb-10">Our Core Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center px-5">
                        <div className="p-6 bg-blue-50 rounded-xl shadow-md hover:bg-blue-100 hover:scale-105 transform transition-all duration-300">
                            <Lightbulb className="w-12 h-12 text-blue-700 mx-auto mb-4" />
                            <h3 className="text-2xl font-semibold text-blue-700">Innovation</h3>
                            <p className="mt-2 text-gray-600">We integrate cutting-edge AI solutions to improve healthcare processes.</p>
                        </div>
                        <div className="p-6 bg-blue-50 rounded-xl shadow-md hover:bg-blue-100 hover:scale-105 transform transition-all duration-300">
                            <Heart className="w-12 h-12 text-blue-700 mx-auto mb-4" />
                            <h3 className="text-2xl font-semibold text-blue-700">Compassion</h3>
                            <p className="mt-2 text-gray-600">We prioritize patient well-being and personalized care above all.</p>
                        </div>
                        <div className="p-6 bg-blue-50 rounded-xl shadow-md hover:bg-blue-100 hover:scale-105 transform transition-all duration-300">
                            <Award className="w-12 h-12 text-blue-700 mx-auto mb-4" />
                            <h3 className="text-2xl font-semibold text-blue-700">Excellence</h3>
                            <p className="mt-2 text-gray-600">Our commitment to quality drives our exceptional healthcare solutions.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutUs;
