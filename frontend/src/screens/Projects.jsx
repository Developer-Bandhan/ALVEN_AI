import React, { useEffect, useState, useRef } from 'react';
import { IoIosArrowForward, IoIosArrowUp } from "react-icons/io";
import { FaProjectDiagram } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import { IoPersonSharp } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import { RiSendPlaneFill } from "react-icons/ri";
import { GoSidebarCollapse, GoSidebarExpand } from 'react-icons/go';
import logo from '../assets/ALVEN_logo.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import { gsap } from 'gsap';

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const Projects = () => {
  const navigate = useNavigate()
  const [showAll, setShowAll] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [project, setProject] = useState([]);
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [showCollaboratorsId, setShowCollaboratorsId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCollaborators, setSelectedCollaborators] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const collaboratorsRef = useRef(null);
  const sidebarref = useRef(null);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
    console.log(isSidebarOpen)
  }

  const toggleCollaborators = (projectIndex) => {
    setShowCollaborators(!showCollaborators);
    setShowCollaboratorsId(showCollaboratorsId === projectIndex ? null : projectIndex);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('/projects/all-projects');
        const projectsWithColors = res.data.projects.map(proj => ({
          ...proj,
          color: getRandomColor(),
          users: proj.users || []
        }));
        setProject(projectsWithColors);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await axios.get('/users/all-users');
        setAllUsers(res.data.users);
      } catch (error) {
        console.error(error);
        if (error.response.data.error == 'Unauthorized User') {
          navigate('/login')
        }
      }
    };

    fetchProjects();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (sidebarref.current) {
      gsap.to(sidebarref.current, {
        x: isSidebarOpen ? '-100%' : '0%',
        duration: 0.6,
        ease: 'power2.inOut'

      })
    }

  }, [isSidebarOpen])

  useEffect(() => {
    if (collaboratorsRef.current) {
      if (showCollaboratorsId !== null) {
        gsap.to(collaboratorsRef.current, {
          x: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        gsap.to(collaboratorsRef.current, {
          x: '-100%',
          duration: 0.3,
          ease: 'power2.in'
        });
      }
    }
  }, [showCollaboratorsId]);

  useEffect(() => {
    if (selectedProjectId) {
      handleSelectProject();
    }
  }, [selectedProjectId]);

  const handleSelectProject = async () => {
    try {
      const res = await axios.get(`/projects/get-project/${selectedProjectId}`);
      setSelectedProject(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddCollaborators = async (selectedUsers) => {
    try {
      const res = await axios.put('/projects/add-user', {
        projectId: selectedProjectId,
        users: selectedUsers
      });
      setSelectedCollaborators(selectedUsers);
      setShowModal(false);
      // Refresh the project data
      const updatedRes = await axios.get('/projects/all-projects');
      const projectsWithColors = updatedRes.data.projects.map(proj => ({
        ...proj,
        color: getRandomColor(),
        users: proj.users || []
      }));
      setProject(projectsWithColors);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='w-full h-screen bg-[#151E35]'>
      <div className='w-full h-[10vh] justify-between items-center flex px-5 md:px-10'>
        <div className='md:hidden flex pt-5 items-center float-start'>
          <button
            onClick={toggleSidebar}
            className='text-white md:hidden text-2xl mb-5'
          >
            {isSidebarOpen ? <GoSidebarCollapse /> : <GoSidebarExpand />}
          </button>
        </div>
        <Link to={'/'} className='w-1/2 md:flex gap-2 hidden  ml-20 md:ml-0 md:justify-start items-center h-full'>
          <img className='w-[8vw] hi md:w-[2vw]' src={logo} alt="LOGO" />
          <h4 className='text-white font-semibold'>ALVEN <span className='text-[#2E65E4]'>AI</span></h4>
        </Link>
        <div className='flex justify-center items-center gap-2 md:gap-5'>
          <button className='py-2 px-4 bg-[#2E65E4] rounded-full'>
            <h3 className='flex items-center  justify-center gap-2 text-white'> <span><FaProjectDiagram /></span> New</h3>
          </button>
          <div className='w-[11vw] hidden md:block h-[11vw] overflow-hidden md:h-[2.8vw] md:w-[2.8vw] rounded-full'>
            <img className='w-full h-full object-cover' src="https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg" alt="User" />
          </div>
        </div>
      </div>
      <div className='w-full h-[90vh] justify-between  px-5 md:px-10 pb-8 flex'>
        <div className='h-full md:w-[20%] overflow-hidden'>
          <div
            ref={sidebarref}
            className='left h-full md:flex flex-col justify-between md:w-[100%] bg-[#0F172B] rounded-3xl p-5 relative overflow-hidden'
          >
            <div className='flex flex-col h-full'>
              {/* Projects Section */}
              <div className='flex-1 overflow-hidden flex flex-col'>
                <div className='flex justify-between items-center'>
                  <h2 className='text-white text-xl font-bold mb-5'>Projects</h2>
                </div>
                <div className=' h-[45vh] overflow-y-auto custom-scrollbar'>
                  <div className='space-y-2 md:space-y-3'>
                    {(showAll ? project : project.slice(0, 6)).map((proj, index) => (
                      <div
                        key={index}
                        className={`flex justify-between items-center p-2 rounded-lg cursor-pointer transition-all duration-300 ${selectedProjectId === proj._id ? 'bg-[#1E2A47]' : hoveredProject === index ? 'bg-[#283554]' : ''}`}
                        onClick={() => setSelectedProjectId(proj._id)}
                        onMouseEnter={() => setHoveredProject(index)}
                        onMouseLeave={() => setHoveredProject(null)}
                      >
                        <div className='flex items-center'>
                          <div className='w-2 h-2 rounded-full mr-3' style={{ backgroundColor: proj.color }}></div>
                          <span className='text-white text-sm'>{proj.name}</span>
                        </div>
                        <span
                          className='text-gray-400 flex items-center justify-center gap-2 text-xs cursor-pointer'
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCollaborators(index);
                          }}
                        >
                          <span><IoPersonSharp /></span>{proj.users.length || '1'}
                        </span>
                      </div>
                    ))}
                    {project.length > 6 && (
                      <div className='text-[#16A34A] text-sm cursor-pointer hover:underline' onClick={toggleShowAll}>
                        {showAll ? (
                          <span className='flex justify-start gap-1 items-center'>
                            Show less <IoIosArrowUp />
                          </span>
                        ) : (
                          <span className='flex justify-start gap-1 items-center'>
                            Show all <IoIosArrowForward />
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Code Review Section - Fixed at bottom */}
              <div className='w-full h-[25vh] md:h-[23vh] mt-auto p-3 flex flex-col justify-between text-white bg-[#1B2841] rounded-2xl'>
                <h4 className='text-[24px] text-[#c6c6c6] font-semibold leading-none'>Code Review</h4>
                <p className='text-[14px] text-[#818998]'>Paste code to get AI-powered reviews for better quality... </p>
                <div className='w-full flex justify-end'>
                  <button className='bg-[#2F65E4] py-3 px-4 rounded-xl w-full text-sm transition-all duration-300 hover:scale-105 hover:bg-[#1E4BB8]'>
                    Try Demo
                  </button>
                </div>
              </div>
            </div>

            {/* Collaborators Slider */}
            <div
              ref={collaboratorsRef}
              className='absolute top-0 left-0 w-full h-full bg-[#0F172B] p-5 transform -translate-x-full'
            >
              <div className='flex justify-between items-center mb-5'>
                <h2 className='text-white text-xl font-bold'>Collaborators</h2>
                <button
                  className='text-white text-xl'
                  onClick={() => setShowCollaboratorsId(null)}
                >
                  &times;
                </button>
              </div>
              <div className='space-y-3 overflow-y-auto max-h-[70vh] custom-scrollbar'>
                {showCollaboratorsId !== null && project[showCollaboratorsId]?.users.map((user, index) => (
                  <div key={index} className='flex items-center gap-3'>
                    <img
                      className='w-8 h-8 rounded-full'
                      src={user.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2Qz0HyHyXWvh8VZMmJL3nmpVDSkxb_wcNDA&s'}
                      alt={user.username || 'User'}
                    />
                    <span className='text-white text-sm'>{user.username || 'User Name'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {selectedProject ? (
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
                type="text"
                placeholder="Type a message..."
                className='w-full bg-[#1E2A47] text-white p-3 rounded-lg outline-none'
              />
              <button className='bg-[#2E65E4] text-2xl text-white px-5 py-3 rounded-lg hover:bg-[#1E4BB8] transition-all duration-300'>
                <RiSendPlaneFill />
              </button>
            </div>
          </div>
        ) : (
          <div className='mid hidden md:ml-5 bg-[#0F172B] md:flex flex-col w-full h-full md:w-[60%] rounded-3xl p-5'>
            <div className=' w-full h-full flex flex-col gap-2 opacity-15 justify-center items-center text-white'>
              <img src={logo} alt="Alven AI Logo" />
              <h5 className='font-semibold'>ALVEN <span className='text-[#2F65E4]'>AI</span></h5>
            </div>
          </div>
        )}

        <div className='right hidden md:block ml-5 bg-[#0F172B] h-full w-[20%] rounded-3xl'></div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center p-4">
          <div className="bg-[#0F172B] p-4 rounded-md w-full max-w-sm shadow-lg relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-2xl font-semibold">Select User</h2>
              <button
                className="text-white text-2xl hover:text-gray-400 transition-all duration-200"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[50vh] custom-scrollbar pr-2">
              {allUsers.map(user => (
                <div
                  key={user._id}
                  className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all duration-300 ${selectedCollaborators.includes(user._id)
                    ? 'bg-[#1E2A47] bg-opacity-30 shadow-md'
                    : 'hover:bg-[#2E65E4] hover:bg-opacity-20'
                    }`}
                  onClick={() => {
                    if (selectedCollaborators.includes(user._id)) {
                      setSelectedCollaborators(selectedCollaborators.filter(id => id !== user._id));
                    } else {
                      setSelectedCollaborators([...selectedCollaborators, user._id]);
                    }
                  }}
                >
                  <img
                    className="w-9 h-9 rounded-full border-2 border-transparent transition-all duration-300 hover:border-[#2E65E4]"
                    src={user.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2Qz0HyHyXWvh8VZMmJL3nmpVDSkxb_wcNDA&s'}
                    alt={user.username || 'User'}
                  />
                  <span className="text-white text-base font-medium">{user.username || 'User Name'}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-center">
              <button
                className="w-1/2 bg-[#2E65E4] text-white py-2 rounded-md font-medium hover:bg-[#1E4FD7] transition-all duration-200"
                onClick={() => handleAddCollaborators(selectedCollaborators)}
              >
                Add Collaborators
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;