import React from 'react';
import logo from '../assets/ALVEN_logo.png';
import { Link } from 'react-router-dom'
import { GrProjects } from "react-icons/gr";

const Navbar = () => {
    return (
        <nav className='w-full h-[11vh] flex bg-[#0F172B] border-b border-[#1A2342] px-5 md:px-10 absolute'>
            <div className='w-1/2 flex gap-2 items-center h-full'>
                <img className='w-[8vw] md:w-[2vw]' src={logo} alt="LOGO" />
                <h4 className='text-white font-semibold'>ALVEN <span className='text-[#2E65E4]'>AI</span></h4>
            </div>
            <div className='w-1/2 h-full flex justify-end items-center gap-4'>
                <Link
                    className="text-white border flex items-center justify-center gap-2 rounded-full border-[#16A34A] px-4 py-2 text-sm transition-all duration-300 ease-in-out hover:text-[#16A34A] hover:bg-[#16A34A]/10 hover:shadow-lg hover:scale-105"
                    to={'/all-projects'}
                >
                  <span className='text-[#16a34a]'><GrProjects/></span>  <p className='hidden md:block'>All Projects</p>
                </Link>
                <div className='w-[11vw] h-[11vw] overflow-hidden md:h-[2.8vw] md:w-[2.8vw] rounded-full'>
                    <img className='w-full h-full object-cover' src="https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg" alt="User" />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;