import React, { useEffect, useState, useContext } from 'react';
import { FaVideo } from "react-icons/fa6";
import { RiSendPlaneFill } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";
import { IoPersonSharp } from "react-icons/io5";
import { receiveMessage, sendMessage } from '../config/socket';
import { UserContext } from '../context/userContext'





const ProjectChat = ({ selectedProject, setShowModal }) => {

    const [message, setMessage] = useState('');
    const { user } = useContext(UserContext)

    

    function send() {
        sendMessage('project-message', {
            message,
            sender: user._id
        })
    
        setMessage("")
    
    }

    useEffect(() => {
        receiveMessage('project-message', data => {
            console.log(data)
        })
    }, [])

    return (
        <div className='mid md:ml-5 bg-[#0F172B] md:flex flex-col w-full h-full md:w-[60%] rounded-3xl p-5'>
            <div className='text-white flex justify-between items-center text-lg font-bold border-b border-gray-600 pb-3 mb-3'>
                {selectedProject.project?.name || "Project Name"}
                <div className='flex items-center gap-2'>
                    <button
                        className=' text-[#16A34A] font-light px-3 py-2 rounded-full border border-[#16A34A]'
                        onClick={() => setShowModal(true)}
                    >
                        <span className='flex items-center'>
                            <span className='text-sm'> <FaPlus /></span>
                            <IoPersonSharp />
                        </span>
                    </button>
                    <button className=' text-[#16A34A] px-3 py-2 rounded-full border border-[#16A34A]'>
                        <FaVideo />
                    </button>
                </div>
            </div>

            <div className='flex-1 overflow-y-auto space-y-3 p-3 custom-scrollbar'>
                <div className='flex gap-3 items-start'>
                    <img className='w-8 h-8 rounded-full' src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" />
                    <div className='bg-[#1E2A47] text-white p-3 rounded-lg max-w-xs'>
                        <span className='font-semibold text-sm'>John Doe</span>
                        <p className='text-sm'>Hey! How's the project going?</p>
                    </div>
                </div>

                <div className='flex gap-3 items-start justify-end'>
                    <div className='bg-[#2E65E4] text-white p-3 rounded-lg max-w-xs'>
                        <span className='font-semibold text-sm'>You</span>
                        <p className='text-sm'>It's going great! Just finalizing some parts.</p>
                    </div>
                    <img className='w-8 h-8 rounded-full' src="https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg" alt="Me" />
                </div>
            </div>

            <div className='border-t border-gray-600 pt-3 flex items-center gap-3'>
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    type="text"
                    placeholder="Type a message..."
                    className='w-full bg-[#1E2A47] text-white p-3 rounded-lg outline-none'
                />
                <button onClick={send} className='bg-[#2E65E4] text-2xl text-white px-5 py-3 rounded-lg hover:bg-[#1E4BB8] transition-all duration-300'>
                    <RiSendPlaneFill />
                </button>
            </div>
        </div>
    );
};

export default ProjectChat;