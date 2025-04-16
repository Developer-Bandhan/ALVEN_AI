import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import logoImg from '../assets/ALVEN_logo.png';
import { GoDotFill } from "react-icons/go";
import { LuSend } from "react-icons/lu";
import { IoCall } from "react-icons/io5";
import { FcVideoCall } from "react-icons/fc";
import axios from '../config/axios'
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [loading, setLoading] = useState(false);
  


  const handleCreateProject = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      const res = await axios.post('/projects/create', { name: projectName })
      setProjectName('');
      setIsModalOpen(false);
      toast.success('Project created successfully');
    } catch (error) {
      if (error.response?.data?.error === 'Unauthorized User') {
        navigate('/login')
      }
      toast.error(error.response.data.error || error.response.data.message || 'server error');
    } finally {
      setLoading(false)
    }

  };




  return (
    <div className='w-full h-screen relative'>
      <Navbar />
      <div className='w-full min-h-full md:flex md:justify-between px-5 md:px-10 pt-[36vw] md:pt-[0vw] bg-[#151e35]'>
        <div className='left md:w-[1/2] md:pt-[12vw]'>
          <img className='' src={logoImg} alt="" />
          <h4 className='text-[#46609C] text-sm border mt-8 md:mt-14 py-1 w-[228px] px-4 rounded-full border-[#1A2342]'>AI-Powered Collaboration Hub</h4>

          <div className='pt-5 text-[#A9AEB7] font-semibold text-[8.5vw] md:text-[3.8vw] md:leading-snug'>
            <h2>Turn Your Vision Into </h2>
            <h2>Reality With Your Team </h2>
          </div>
          <p className='text-[#9298A5] pt-5 md:w-[35vw] md:leading-8 text-sm md:text-[1.2vw]'>Collaborate seamlessly with your team via real-time chat, voice, and video calls, Keep discussions private and secure group chats. Use @AI to get AI replies and code generation.</p>
        </div>
        <div className='right md:w-[40%] md:mt-[6.5vw] mt-16 flex flex-col gap-4'>
          <div className='flex justify-between gap-3'>
            <div className='w-full md:w-[60%] h-[60vw] md:h-[13vw] flex justify-between bg-[#1b2841] p-4 rounded-md hover:scale-95 transition-transform duration-300 ease-in-out'>
              <div className='flex flex-col justify-between'>
                <h1 className='text-[#E8E8E8] text-3xl font-semibold'>Project</h1>
                <p className=' text-[#586071]'>Start a new project and collaborate with your team in real-time.</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className='w-full bg-[#16A34A] p-5 md:p-4 rounded-lg text-white text-xl hover:bg-[#12803A] transition-colors duration-300 ease-in-out'
                >
                  Create Project
                </button>
              </div>
            </div>
            <div className='hidden md:flex flex-col  h-[13vw] w-[40%] '>
              <div className='flex justify-center items-center p-2 rounded-full w-1/2 underline text-[#8F613A] bg-[#2B2B44] '> <span className='pt-1'><GoDotFill /></span> <span>Features</span></div>
              <div className='flex justify-center items-center p-2 rounded-full ml-36 text-[#ffffff] bg-[#16A34A] '><span>AI</span></div>
              <div className='flex justify-center items-center p-2 rounded-md text-[#ffffff] mt-4 bg-[#2E65E4] '><span className=' p-2 text-xl'><LuSend /></span><span>Chat with team</span></div>
              <div className='flex items-center justify-center gap-3 mt-3'>
                <div className='flex justify-center items-center py-2 text-2xl px-5 rounded-full  text-[#16A34A] border border-[#42805192] '> <span className=''><IoCall /></span></div>
                <div className='flex justify-center items-center py-2 text-2xl px-5 rounded-full  text-[#16A34A] border border-[#42805192] '> <span className=''><FcVideoCall /></span></div>
              </div>
            </div>
          </div>
          <div className='w-full h-[60vw] md:h-[11vw] flex flex-col justify-between bg-[#101729] p-4 rounded-md hover:scale-95 transition-transform duration-300 ease-in-out'>
            <h1 className='text-[#E8E8E8] text-3xl font-semibold'>Web Container</h1>
            <p className=' text-[#586071]'>Run and test your code directly in the browser with our integrated web container.</p>
            <div className='flex justify-end'>
              <button className='w-full bg-[#9333EA] p-5 md:p-3 md:w-[13vw] rounded-lg text-white text-xl hover:bg-[#7B2CBF] transition-colors duration-300 ease-in-out'>Open Container</button>
            </div>
          </div>
          <div className='w-full h-[60vw] md:h-[11vw] flex flex-col justify-between bg-[#101729] p-4 rounded-md hover:scale-95 transition-transform duration-300 ease-in-out'>
            <h1 className='text-[#E8E8E8] text-3xl font-semibold'>Code Review</h1>
            <p className=' text-[#586071] md:w-[33vw]'>Paste your code and get AI-powered reviews to improve your code quality.</p>
            <div className='flex justify-end'>
              <button className='w-full bg-[#2E65E4] md:p-3 md:w-[13vw] p-5 rounded-lg text-white text-xl hover:bg-[#1E4BBF] transition-colors duration-300 ease-in-out'>Try Demo</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1b2841] text-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Create New Project</h2>
            <form onSubmit={handleCreateProject}>
              <input
                type="text"
                placeholder="Enter Project Name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full p-2 rounded-md bg-[#101729] text-white placeholder-[#586071] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                required
              />
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-[#586071] hover:bg-[#464f5d] text-white font-bold py-2 px-4 rounded transition-colors duration-300 ease-in-out"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#16A34A] hover:bg-[#12803A] text-white font-bold py-2 px-4 rounded transition-colors duration-300 ease-in-out"
                >
                  {loading ? <LoadingSpinner /> : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;