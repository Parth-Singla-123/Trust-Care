"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { GoChevronRight } from "react-icons/go";
import { FaStethoscope } from "react-icons/fa";

const diseases = ["Asthma", "Tuberculosis", "Influenza", "Malaria", "Dengue", "Cholera", "Polio"];
var i = 0;

function Diseases() {
    const [di, setDisease] = useState(diseases[0]);
    const [isHovered, setHover] = useState(false);
    const [isChange, setChange] = useState(false);

    useEffect(() => {
        const intervalId = setInterval(() => {
            i = (i + 1) % diseases.length;
            setChange(true);
            setTimeout(() => {
                setDisease(diseases[i]);
                setChange(false);
            }, 1000);
        }, 2500);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="text-center py-15 font-medium px-4 md:px-0 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg shadow-md">
            {/* Header */}
            <h1 className="text-[37px] md:text-[55px] text-blue-900 font-extrabold font-serif">
                Get Care Today For
            </h1>

            {/* Animated Disease Text */}
            <div className="text-[30px] md:text-[42px] text-indigo-900 -mt-2 relative inline-block">
                <h1 className={`transition-transform duration-700 ${isChange ? "scale-110" : "scale-100"}`}>
                    {di}
                </h1>
                <div className="absolute -bottom-1 w-1/3 h-[3px] bg-violet-900 mx-auto left-0 right-0 rounded-full" />
            </div>

            {/* CTA Section */}
            <div className="flex flex-row place-content-center mt-4">
                <Link
                    href="#"
                    className="text-sm md:text-base text-blue-900 font-semibold flex items-center space-x-2"
                    onMouseOver={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                >
                    <FaStethoscope className="text-blue-900 text-lg md:text-xl" />
                    <span>Consult doctors for treatment</span>
                    <span
                        className={isHovered ? "translate-x-1 transition-all duration-500" : "-translate-x-1 transition-all duration-500"}
                    >
                        <GoChevronRight className="text-blue-900 text-sm mt-1" />
                    </span>
                </Link>
            </div>

            {/* Inspiring Tagline */}
            <h1 className="text-[22px] md:text-[40px] text-indigo-900 font-bold font-serif w-4/5 mx-auto leading-[45px] md:leading-[55px] mt-6">
                Fall in love with your doctor’s office
            </h1>

        </div>
    );
}

export default Diseases;
