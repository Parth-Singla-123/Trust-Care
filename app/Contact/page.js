"use client";
import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

function ContactPage() {
    return (
        <div className="bg-gradient-to-r from-blue-100 to-blue-200 min-h-screen py-20 font-sans">
            {/* Hero Section */}
            <motion.div 
                className="container mx-auto px-6 py-16 text-center md:text-left"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
            >
                <h1 className="text-4xl md:text-6xl font-extrabold text-blue-800 mb-4">
                    Let us Get in <span className="text-gray-700">Touch</span>
                </h1>
                <p className="text-lg text-gray-700">
                    Reach out for inquiries, appointments, or feedback. We are here to help you.
                </p>
            </motion.div>

            {/* Contact Cards */}
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 py-12 px-6 text-black">
                {[
                    { icon: <FaPhoneAlt />, title: "Call Us", content: "+1 (800) 123-4567" },
                    { icon: <FaEnvelope />, title: "Email Us", content: "support@trustcare.com" },
                    { icon: <FaMapMarkerAlt />, title: "Visit Us", content: "123 Health Blvd, Wellness City" }
                ].map((item, index) => (
                    <motion.div 
                        key={index} 
                        className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4 border-t-4 border-blue-500"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 200 }}
                    >
                        <div className="text-blue-500 text-3xl">{item.icon}</div>
                        <div>
                            <h3 className="text-xl font-bold">{item.title}</h3>
                            <p className="text-gray-600">{item.content}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Contact Form */}
            <div className="bg-white shadow-lg p-8 rounded-xl container mx-auto py-12 w-full md:w-3/4 lg:w-1/2">
                <motion.h2 
                    className="text-3xl font-bold text-center text-blue-700 mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.7 }}
                >
                    Send us a Message
                </motion.h2>
                <form className="space-y-6 text-black">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Your Name"
                            className="w-full border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <input
                            type="email"
                            placeholder="Your Email"
                            className="w-full border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <input
                        type="text"
                        placeholder="Subject"
                        className="w-full border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <textarea
                        placeholder="Your Message"
                        rows="5"
                        className="w-full border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    ></textarea>
                    <motion.button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-600"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Send Message
                    </motion.button>
                </form>
            </div>
        </div>
    );
}

export default ContactPage;
