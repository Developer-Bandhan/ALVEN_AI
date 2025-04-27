import React, { useEffect, useState, useContext } from 'react';
import { FaVideo } from "react-icons/fa6";
import { RiSendPlaneFill } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";
import { IoPersonSharp } from "react-icons/io5";
import { receiveMessage, sendMessage } from '../config/socket';
import { UserContext } from '../context/userContext';

const ProjectChat = ({ selectedProject, setShowModal }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const { user } = useContext(UserContext);

    // Filter messages for the current project
    const currentProjectMessages = messages.filter(
        msg => msg.projectId === selectedProject.project?._id
    );

    function send() {
        if (!user || !user._id || !selectedProject.project?._id) {
            console.error("Missing required data");
            return;
        }

        if (!message.trim()) return;

        const newMessage = {
            text: message,
            sender: user._id,
            projectId: selectedProject.project._id,
            timestamp: Date.now(),
            isMe: true
        };

        setMessages(prev => [...prev, newMessage]);

        sendMessage('project-message', {
            message: message,
            sender: user._id,
            projectId: selectedProject.project._id
        });

        setMessage("");
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            send();
        }
    };

    useEffect(() => {
        // Fetch initial messages for this project
        const fetchMessages = async () => {
            try {
                // Replace with your actual API call
                // const response = await getMessagesForProject(selectedProject.project._id);
                // setMessages(response.data);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        if (selectedProject.project?._id) {
            fetchMessages();
        }

        // Socket listener for incoming messages
        receiveMessage('project-message', (data) => {
            if (data.projectId === selectedProject.project?._id) {
                setMessages(prev => [...prev, {
                    text: data.message,
                    sender: data.sender,
                    projectId: data.projectId,
                    timestamp: Date.now(),
                    isMe: data.sender === user?._id
                }]);
            }
        });

        return () => {
            // Cleanup if needed
        };
    }, [selectedProject.project?._id, user?._id]);

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
                {currentProjectMessages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex gap-3 items-start ${msg.isMe ? 'justify-end' : ''}`}
                    >
                        {!msg.isMe && (
                            <img
                                className='w-8 h-8 rounded-full'
                                src="https://randomuser.me/api/portraits/men/32.jpg"
                                alt="User"
                            />
                        )}
                        <div className={`${msg.isMe ? 'bg-[#2E65E4]' : 'bg-[#1E2A47]'} text-white px-2 py-1 rounded-lg max-w-xs`}>
                            <span className='text-sm'>
                                {msg.isMe ? 'You' : 'John Doe'}
                            </span>
                            <div className='flex gap-8'>
                                <p className=''>{msg.text}</p>
                                <p className='text-xs text-gray-300 mt-2'>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                        {msg.isMe && (
                            <img
                                className='w-8 h-8 rounded-full'
                                src="https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg"
                                alt="Me"
                            />
                        )}
                    </div>
                ))}
            </div>

            <div className='border-t border-gray-600 pt-3 flex items-center gap-3'>
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    type="text"
                    placeholder="Type a message..."
                    className='w-full bg-[#1E2A47] text-white p-3 rounded-lg outline-none'
                />
                <button
                    onClick={send}
                    disabled={!message.trim()}
                    className='bg-[#2E65E4] text-2xl text-white px-5 py-3 rounded-lg hover:bg-[#1E4BB8] transition-all duration-300 disabled:opacity-50'
                >
                    <RiSendPlaneFill />
                </button>
            </div>
        </div>
    );
};

export default ProjectChat;