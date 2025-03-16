"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc'; // Google Icon Import
import { supabase } from '../../lib/supabaseClient';

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isHovered, setHover] = useState(false);
    const [user, setUser] = useState(null);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setUser(session.user);
            } else {
                setUser(null);
            }
        });

        fetchUser();

        return () => authListener.subscription.unsubscribe();
    }, []);

    async function handleSubmit() {
        window.location.reload();
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });

        if (error) {
            console.error('Google Sign-In Error:', error.message);
        }
    }

    async function handleLogout() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Logout Error:', error.message);
        } else {
            setUser(null);
        }
    }

    return (
        <nav className="bg-gradient-to-r from-blue-500 to-blue-600 text-blue-50 shadow-lg fixed top-0 w-full z-50">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="text-2xl sm:text-3xl md:text-4xl font-extrabold">
                    Trust<span className="text-gray-800">+</span>Care
                </Link>

                {/* Desktop Navigation Links */}
                <div className="hidden lg:flex space-x-8 text-sm md:text-base lg:text-lg relative">
                    <Link href="/" className="hover:text-blue-200 transition">Home</Link>

                    {/* Services with Animated Dropdown */}
                    <div
                        className="relative group"
                        onMouseEnter={() => setShowDropdown(true)}
                        onMouseLeave={() => setTimeout(() => setShowDropdown(false), 250)}
                    >
                        <span className="hover:text-blue-200 transition cursor-pointer">
                            Services
                        </span>

                        {/* Dropdown Menu with Animation */}
                        <div
                            className={`absolute top-10 left-0 w-48 md:w-56 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg shadow-md z-10 text-sm md:text-base
                            transition-all duration-300 ease-in-out transform ${(showDropdown || isHovered) ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
                            onMouseEnter={() => setHover(true)}
                            onMouseLeave={() => setTimeout(() => setHover(false), 250)}
                        >
                            <Link href="/Appointments" className="block px-4 py-2 hover:bg-blue-200 rounded-t-md">
                                Appointment
                            </Link>
                            <Link href="/WaitingTime" className="block px-4 py-2 hover:bg-blue-200">
                                Waiting Time
                            </Link>
                            <Link href="/ResourceAllocator" className="block px-4 py-2 hover:bg-blue-200 rounded-b-md">
                                Resource Management
                            </Link>
                        </div>
                    </div>

                    <Link href="/About" className="hover:text-blue-200 transition">About Us</Link>
                    <Link href="/Contact" className="hover:text-blue-200 transition">Contact</Link>
                </div>

                {/* Google Sign-In Button / Logout */}
                <div className="hidden lg:flex items-center space-x-4">
                    {user ? (
                        <>
                            <span className="font-bold text-sm md:text-base text-white">
                                {user.user_metadata.full_name}
                            </span>
                            <button
                                className="bg-gray-900 text-white px-3 lg:px-4 py-1.5 lg:py-2 rounded-full hover:bg-gray-800 transition font-semibold shadow-md"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <button
                            className="flex items-center justify-center bg-white text-gray-700 px-3 lg:px-6 py-1.5 lg:py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition font-semibold shadow-md w-36 lg:w-60"
                            onClick={handleSubmit}
                        >
                            <FcGoogle className="text-2xl mr-2" />
                            <span className="text-sm lg:text-base">Sign in with Google</span>
                        </button>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="lg:hidden">
                    <button className="focus:outline-none" onClick={toggleMenu}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16m-7 6h7"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Sliding Menu */}
            <div className={`fixed top-0 right-0 h-full w-1/2 sm:w-2/5 bg-blue-700 text-white transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out shadow-lg`} >
                <div className="p-6 space-y-4">
                    <button onClick={toggleMenu} className="text-right text-2xl font-bold">&times;</button>
                    <Link href="/" className="block hover:text-blue-400 transition">Home</Link>
                    <Link href="/Appointments" className="block hover:text-blue-400 transition">Appointment</Link>
                    <Link href="/WaitingTime" className="block hover:text-blue-400 transition">Waiting Time</Link>
                    <Link href="/ResourceAllocator" className="block hover:text-blue-400 transition">Resource Allocator</Link>
                    <Link href="/About" className="block hover:text-blue-400 transition">About Us</Link>
                    <Link href="/Contact" className="block hover:text-blue-400 transition">Contact</Link>

                    <div className="mt-6">
                        <button className="flex items-center justify-center bg-white text-gray-700 px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition font-semibold shadow-md w-full"
                            onClick={handleSubmit}
                        >
                            <FcGoogle className="text-2xl mr-2" />
                            <span className="text-sm">Sign in with Google</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
