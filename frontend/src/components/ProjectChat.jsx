import React, { useEffect, useState, useContext, useCallback } from 'react';
import { FaVideo } from "react-icons/fa6";
import { RiSendPlaneFill } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";
import { IoPersonSharp } from "react-icons/io5";
import { receiveMessage, sendMessage } from '../config/socket';
import { UserContext } from '../context/userContext';
import axios from 'axios';

const ProjectChat = ({ selectedProject, setShowModal }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState({});
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const { user } = useContext(UserContext);

    const currentProjectMessages = messages.filter(
        msg => msg.projectId === selectedProject.project?._id
    );

    const fetchUsers = useCallback(async () => {
        setIsLoadingUsers(true);
        try {
            const res = await axios.get('/users/all-users');
            if (res.data?.users) {
                const usersData = {};
                res.data.users.forEach(u => {
                    usersData[u._id] = {
                        username: u.username,
                        avatar: u.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'
                    };
                });
                setUsers(prev => ({ ...prev, ...usersData }));
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setIsLoadingUsers(false);
        }
    }, []);

    useEffect(() => {
        if (selectedProject.project?._id) {
            fetchUsers();
        }
    }, [selectedProject.project?._id, fetchUsers]);

    const send = useCallback(() => {
        if (!user?._id || !selectedProject.project?._id || !message.trim()) return;

        const newMessage = {
            text: message,
            sender: {
                _id: user._id,
                username: user.username,
                avatar: user.avatar
            },
            projectId: selectedProject.project._id,
            timestamp: Date.now(),
            isMe: true
        };

        setMessages(prev => [...prev, newMessage]);

        sendMessage('project-message', {
            message: message,
            sender: {
                _id: user._id,
                username: user.username
            },
            projectId: selectedProject.project._id
        });

        setMessage("");
    }, [message, selectedProject.project?._id, user]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            send();
        }
    };

    useEffect(() => {
        const handleIncomingMessage = (data) => {
            if (data.projectId === selectedProject.project?._id) {
                const isMe = data.sender._id === user?._id;
                const isAi = data.sender._id === 'ai-bot';
                
                // Update users data if new user
                if (!isAi && !isMe && !users[data.sender._id]) {
                    fetchUsers();
                }

                setMessages(prev => [
                    ...prev,
                    {
                        text: data.message,
                        sender: data.sender,
                        projectId: data.projectId,
                        timestamp: data.timestamp,
                        isMe,
                        isAi
                    }
                ]);
            }
        };

        receiveMessage('project-message', handleIncomingMessage);

        return () => {
            // Cleanup if needed
        };
    }, [selectedProject.project?._id, user?._id, users, fetchUsers]);

    const getAvatar = (msg) => {
        if (msg.isAi) return 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png';
        if (msg.isMe) return user?.avatar || 'https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg';
        return users[msg.sender._id]?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg';
    };

    const getSenderName = (msg) => {
        if (msg.isMe) return 'You';
        if (msg.isAi) return 'AI Assistant';
        return users[msg.sender._id]?.username || msg.sender.username || 'Team Member';
    };

    return (
        <div className='mid md:ml-5 bg-[#0F172B] md:flex flex-col w-full h-full md:w-[60%] rounded-3xl p-5'>
            <div className='text-white flex justify-between items-center text-lg font-bold border-b border-gray-600 pb-3 mb-3'>
                {selectedProject.project?.name || "Project Name"}
                <div className='flex items-center gap-2'>
                    <button
                        className='text-[#16A34A] font-light px-3 py-2 rounded-full border border-[#16A34A]'
                        onClick={() => setShowModal(true)}
                    >
                        <span className='flex items-center'>
                            <span className='text-sm'><FaPlus /></span>
                            <IoPersonSharp />
                        </span>
                    </button>
                    <button 
                        className='text-[#16A34A] px-3 py-2 rounded-full border border-[#16A34A]' 
                        onClick={() => {}}
                    >
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
                                src={getAvatar(msg)}
                                alt={getSenderName(msg)}
                            />
                        )}
                        <div className={`${
                            msg.isMe ? 'bg-[#2E65E4]' : 
                            msg.isAi ? 'bg-[#3A3A3A]' : 
                            'bg-[#1E2A47]'
                        } text-white px-2 py-1 rounded-lg max-w-xs`}>
                            <span className='text-sm'>{getSenderName(msg)}</span>
                            <div className='flex gap-8'>
                                <p>{msg.text}</p>
                                <p className='text-xs text-gray-300 mt-2'>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                    })}
                                </p>
                            </div>
                        </div>
                        {msg.isMe && (
                            <img
                                className='w-8 h-8 rounded-full'
                                src={getAvatar(msg)}
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