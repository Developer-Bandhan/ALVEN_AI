const CollaboratorModal = ({ users, onClose, onAddCollaborators }) => {
    const [selectedUsers, setSelectedUsers] = useState([]);

    const handleUserSelect = (userId) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        } else {
            setSelectedUsers([...selectedUsers, userId]);
        }
    };

    const user = [
        { id: '1', username: 'john smith' },
        { id: '2', username: 'john smith' },
        { id: '3', username: 'john smith' },
        { id: '4', username: 'john smith' },
        { id: '5', username: 'john smith' },
        { id: '6', username: 'john smith' },
        { id: '7', username: 'john smith' },
    ]

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center p-4">
            <div className="bg-[#0F172B] p-4 rounded-md w-full max-w-sm shadow-lg relative">
                {/* Modal Header with Close Button */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-white text-2xl font-semibold">Select User</h2>
                    <button
                        className="text-white text-2xl hover:text-gray-400 transition-all duration-200"
                        onClick={onClose}
                    >
                        &times;
                    </button>
                </div>

                {/* User List */}
                <div className="space-y-3 overflow-y-auto max-h-[50vh] custom-scrollbar pr-2">
                    {user.map(user => (
                        <div
                            key={user.id}
                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ${selectedUsers.includes(user.id)
                                    ? 'bg-[#1E2A47] bg-opacity-30 shadow-md'
                                    : 'hover:bg-[#2E65E4] hover:bg-opacity-20'
                                }`}
                            onClick={() => handleUserSelect(user.id)}
                        >
                            <img
                                className="w-9 h-9 rounded-full border-2 border-transparent transition-all duration-300 hover:border-[#2E65E4]"
                                src={user.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2Qz0HyHyXWvh8VZMmJL3nmpVDSkxb_wcNDA&s'}
                                alt={user.username}
                            />
                            <span className="text-white text-base font-medium">{user.username || 'User Name'}</span>
                        </div>
                    ))}
                </div>

                {/* Confirm Button */}
                <div className="mt-6 flex items-center justify-center">
                    <button
                        className="w-1/2 bg-[#2E65E4] text-white py-2 rounded-md font-medium hover:bg-[#1E4FD7] transition-all duration-200"
                        onClick={() => onAddCollaborators(selectedUsers)}
                    >
                        Add Collaborators
                    </button>
                </div>
            </div>
        </div>
    );



};

export default CollaboratorModal;