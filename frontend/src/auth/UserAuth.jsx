import React, { useContext, useEffect } from 'react'
import { UserContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';

const UserAuth = ({ children }) => {

    const { user } = useContext(UserContext);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();



    useEffect(() => {

        if (!token) {
            navigate('/login')
        }

        // if (!user) {
        //     navigate('/login')
        // }

    }, [])

    return (
        <>
            {children}
        </>
    )
}

export default UserAuth