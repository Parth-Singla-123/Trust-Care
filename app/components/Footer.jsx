"use client";
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gradient-to-r from-blue-500 to-blue-700 text-blue-100 py-10">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* About Section */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Trust<span className="text-green-200">+</span>Care</h2>
                    <p className="text-sm text-gray-200">
                        Empowering healthcare with innovative solutions.  
                        We provide seamless appointment booking, waiting time prediction, and resource management.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                        <li>
                            <Link href="/" className="hover:text-green-200 transition">Home</Link>
                        </li>
                        <li>
                            <Link href="/services" className="hover:text-green-200 transition">Services</Link>
                        </li>
                        <li>
                            <Link href="/about" className="hover:text-green-200 transition">About Us</Link>
                        </li>
                        <li>
                            <Link href="/contact" className="hover:text-green-200 transition">Contact</Link>
                        </li>
                    </ul>
                </div>

                {/* Contact Information */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
                    <p className="text-sm text-gray-200">📍 123 Health St, Wellness City</p>
                    <p className="text-sm text-gray-200">📞 +1 (234) 567-890</p>
                    <p className="text-sm text-gray-200">📧 support@trustcare.com</p>

                    {/* Social Media Icons */}
                    <div className="flex space-x-4 mt-4">
                        <a href="#" className="hover:text-green-200 transition">
                            <Facebook className="w-5 h-5" />
                        </a>
                        <a href="#" className="hover:text-green-200 transition">
                            <Instagram className="w-5 h-5" />
                        </a>
                        <a href="#" className="hover:text-green-200 transition">
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a href="#" className="hover:text-green-200 transition">
                            <Linkedin className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom Copyright Line */}
            <div className="mt-8 border-t border-blue-300 pt-4 text-center text-sm text-gray-200">
                © {new Date().getFullYear()} Trust+Care. All rights reserved.
            </div>
        </footer>
    );
}
