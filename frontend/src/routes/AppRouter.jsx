import React from 'react'
import { Route, BrowserRouter, Routes, } from 'react-router-dom'
import Home from '../screens/Home'
import Signup from '../screens/Signup'
import Login from '../screens/Login'
import ResetPassword from '../components/ResetPassword'
import Projects from '../screens/Projects'

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/" element={<Home />} />
                <Route path="/all-projects" element={<Projects />} />
                
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter