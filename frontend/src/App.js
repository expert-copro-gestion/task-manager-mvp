import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import OrganisationWelcome from './pages/OrganisationWelcome';
import ProfileSelection from './pages/ProfileSelection';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<OrganisationWelcome />} />
                <Route path="/profiles" element={<ProfileSelection />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;