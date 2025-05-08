import React, { useContext, useEffect } from 'react';
import { UserContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';

const UserAuth = ({ children }) => {
    const { user } = useContext(UserContext);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        // Check if there's no token or user data, redirect to login
        if (!token || !user) {
            navigate('/login');
        }
    }, [token, user, navigate]);

    return <>{children}</>;
}

export default UserAuth;





// import React, { useContext, useEffect } from 'react'
// import { UserContext } from '../context/userContext';
// import { useNavigate } from 'react-router-dom';

// const UserAuth = ({ children }) => {

//     const { user } = useContext(UserContext);
//     const token = localStorage.getItem('token');
//     const navigate = useNavigate();



//     useEffect(() => {

//         if (!token) {
//             navigate('/login')
//         }

//         if (!user) {
//             navigate('/login')
//         }

//     }, [])

//     return (
//         <>
//             {children}
//         </>
//     )
// }

// export default UserAuth