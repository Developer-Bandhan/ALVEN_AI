import React, { useEffect, useState, useContext, useCallback, useRef } from 'react'; 
import { FaVideo, FaPlus } from "react-icons/fa6";
import { RiSendPlaneFill } from "react-icons/ri";
import { IoPersonSharp } from "react-icons/io5";
import PropTypes from 'prop-types';
import axios from 'axios';
import { receiveMessage, sendMessage } from '../config/socket';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css'; 
import { useSelector } from 'react-redux';

const DEFAULT_AVATARS = {
  male: 'https://randomuser.me/api/portraits/men/32.jpg',
  female: 'https://randomuser.me/api/portraits/women/44.jpg',
  ai: 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png',
  user: 'https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg'
};

const ProjectChat = ({ selectedProject, setShowModal }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState({});
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [typingMessages, setTypingMessages] = useState({});
  
  const user = useSelector(state => state.auth.user);

  const messagesEndRef = useRef(null);

  const currentProjectMessages = messages.filter(
    msg => msg.projectId === selectedProject.project?._id
  );

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [currentProjectMessages, scrollToBottom, typingMessages]);

  const fetchUsers = useCallback(async () => {
    if (!selectedProject.project?._id) return;

    setIsLoadingUsers(true);
    try {
      const { data } = await axios.get('/users/all-users');
      if (data?.users) {
        const usersMap = data.users.reduce((acc, curr) => ({
          ...acc,
          [curr._id]: {
            username: curr.username,
            avatar: curr.avatar || DEFAULT_AVATARS.male
          }
        }), {});
        setUsers(prev => ({ ...prev, ...usersMap }));
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoadingUsers(false);
    }
  }, [selectedProject.project?._id]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSendMessage = useCallback(() => {
    if (!message.trim() || !user?._id || !selectedProject.project?._id) return;

    const messageData = {
      message: message.trim(),
      sender: {
        _id: user._id,
        username: user.username,
        avatar: user.avatar
      },
      projectId: selectedProject.project._id,
      timestamp: Date.now()
    };

    sendMessage('project-message', messageData);
    setMessage("");
  }, [message, selectedProject.project?._id, user]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // AI-র messages-কে typing effect দিয়ে দেখানোর জন্য
  useEffect(() => {
    const newAiMessages = currentProjectMessages.filter(
      msg => msg.isAi && !typingMessages[msg.timestamp]
    );

    newAiMessages.forEach(msg => {
      setTypingMessages(prev => ({
        ...prev,
        [msg.timestamp]: {
          displayedText: "",
          fullText: msg.message,
          isTypingComplete: false
        }
      }));
    });
  }, [currentProjectMessages, typingMessages]);

  // Typing effect এর জন্য interval সেটআপ
  useEffect(() => {
    const interval = setInterval(() => {
      let hasUpdates = false;
      const updatedTypingMessages = { ...typingMessages };

      Object.keys(updatedTypingMessages).forEach(key => {
        const typingMessage = updatedTypingMessages[key];
        
        if (!typingMessage.isTypingComplete) {
          hasUpdates = true;
          const nextCharIndex = typingMessage.displayedText.length;
          
          if (nextCharIndex < typingMessage.fullText.length) {
            updatedTypingMessages[key] = {
              ...typingMessage,
              displayedText: typingMessage.fullText.substring(0, nextCharIndex + 1)
            };
          } else {
            updatedTypingMessages[key] = {
              ...typingMessage,
              isTypingComplete: true
            };
          }
        }
      });

      if (hasUpdates) {
        setTypingMessages(updatedTypingMessages);
      }
    }, 5); 

    return () => clearInterval(interval);
  }, [typingMessages]);

  useEffect(() => {
    const handleIncomingMessage = (data) => {
      if (data.projectId !== selectedProject.project?._id) return;

      const isMe = data.sender._id === user?._id;
      const isAi = data.sender._id === 'ai-bot';

      if (!isAi && !isMe && !users[data.sender._id]) {
        fetchUsers();
      }

      setMessages(prev => [
        ...prev,
        {
          ...data,
          isMe,
          isAi
        }
      ]);
    };

    const cleanup = receiveMessage('project-message', handleIncomingMessage);
    return () => cleanup?.();
  }, [selectedProject.project?._id, user?._id, users, fetchUsers]);

  const getMessageMetadata = useCallback((msg) => {
    if (msg.isAi) {
      return {
        avatar: DEFAULT_AVATARS.ai,
        name: 'Alven',
        bgColor: 'bg-[#3A3A3A]',
        isTyping: typingMessages[msg.timestamp] && !typingMessages[msg.timestamp].isTypingComplete
      };
    }

    if (msg.isMe) {
      return {
        avatar: user?.avatar || DEFAULT_AVATARS.user,
        name: 'You',
        bgColor: 'bg-[#2E65E4]',
        isTyping: false
      };
    }

    return {
      avatar: users[msg.sender._id]?.avatar || msg.sender.avatar || DEFAULT_AVATARS.male,
      name: users[msg.sender._id]?.username || msg.sender.username || 'Team Member',
      bgColor: 'bg-[#1E2A47]',
      isTyping: false
    };
  }, [user, users, typingMessages]);

  return (
    <div className='mid md:ml-5 bg-[#0F172B] md:flex flex-col w-full h-full md:w-[60%] rounded-3xl p-5'>
      <header className='text-white flex justify-between items-center text-lg font-bold border-b border-gray-600 pb-3 mb-3'>
        {selectedProject.project?.name || "Project Chat"}

        <div className='flex items-center gap-2'>
          <button
            className='text-[#16A34A] font-light px-3 py-2 rounded-full border border-[#16A34A] hover:bg-[#16A34A]/10 transition-colors'
            onClick={() => setShowModal(true)}
            aria-label="Add team member"
          >
            <span className='flex items-center gap-1'>
              <FaPlus size={12} />
              <IoPersonSharp size={16} />
            </span>
          </button>

          <button 
            className='text-[#16A34A] p-2 rounded-full border border-[#16A34A] hover:bg-[#16A34A]/10 transition-colors'
            aria-label="Start video call"
          >
            <FaVideo size={16} />
          </button>
        </div>
      </header>

      <main className='flex-1 overflow-y-auto space-y-3 p-3 custom-scrollbar'>
        {currentProjectMessages.map((msg, index) => {
          const { avatar, name, bgColor, isTyping } = getMessageMetadata(msg);
          
          // AI message এর জন্য typed text ব্যবহার করুন
          const displayText = msg.isAi && typingMessages[msg.timestamp] 
            ? typingMessages[msg.timestamp].displayedText 
            : msg.message;

          return (
            <div
              key={`${msg.timestamp}-${index}`}
              className={`flex gap-3 items-start ${msg.isMe ? 'flex-row-reverse' : ''}`}
            >
              <img
                className='w-8 h-8 rounded-full object-cover flex-shrink-0'
                src={avatar}
                alt={name}
                onError={(e) => {
                  e.target.src = msg.isMe ? DEFAULT_AVATARS.user : DEFAULT_AVATARS.male;
                }}
              />

              <div className={`${bgColor} text-white rounded-lg max-w-7xl md:max-w-6xl overflow-hidden`}>
                <div className="p-3 pb-1">
                  <div className='flex items-center gap-2'>
                    <span className='text-sm font-medium'>{name}</span>
                    {isTyping && (
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                        <div className="w-1 h-1 bg-white rounded-full animate-pulse delay-100"></div>
                        <div className="w-1 h-1 bg-white rounded-full animate-pulse delay-200"></div>
                      </div>
                    )}
                  </div>
                  
                  <div className='mt-1 break-words'>
                    <div className="prose prose-invert max-w-none">
                      <ReactMarkdown 
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                          pre: ({node, ...props}) => (
                            <div className="overflow-x-auto rounded-lg my-2">
                              <pre {...props} />
                            </div>
                          ),
                          code: ({node, inline, className, children, ...props}) => {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            ) : (
                              <code className="bg-gray-700 rounded px-1 py-0.5" {...props}>
                                {children}
                              </code>
                            );
                          }
                        }}
                      >
                        {displayText}
                      </ReactMarkdown>
                      {isTyping && <span className="inline-block w-2 h-4 bg-white ml-1 animate-pulse"></span>}
                    </div>
                  </div>
                </div>
                
                {!isTyping && (
                  <div className="px-3 pb-2 pt-1 flex justify-end">
                    <time 
                      className='text-xs text-gray-300 whitespace-nowrap'
                      dateTime={new Date(msg.timestamp).toISOString()}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </time>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </main>

      <footer className='border-t border-gray-600 pt-3'>
        <div className='flex items-center gap-3'>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            type="text"
            placeholder="Type a message..."
            className='flex-1 bg-[#1E2A47] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-[#2E65E4]'
            aria-label="Message input"
          />

          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className='bg-[#2E65E4] text-white p-3 rounded-lg hover:bg-[#1E4BB8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            aria-label="Send message"
          >
            <RiSendPlaneFill size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
};

ProjectChat.propTypes = {
  selectedProject: PropTypes.shape({
    project: PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string
    })
  }).isRequired,
  setShowModal: PropTypes.func.isRequired
};

export default ProjectChat;