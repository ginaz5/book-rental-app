import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './UserPopover.css';
import LoginModal from "../login/LoginModal.tsx";  // Import the LoginModal component

const UserPopover: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('userId'));
    const [username, setUsername] = useState(localStorage.getItem('username') || 'user');
    const popoverRef = useRef<HTMLDivElement>(null);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        localStorage.clear();  // Clear user data from localStorage
        setIsAuthenticated(false);  // Set authentication state to false
        setIsOpen(false);  // Close the popover
        setUsername('user');  // Reset username to default
        window.location.reload();  // Optionally reload the page after logout
    };

    const handleLoginSuccess = (username: string) => {
        setUsername(username);
        setIsAuthenticated(true);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="user-popover-container" ref={popoverRef}>
            <button className="user-button" onClick={handleToggle}>
                {isAuthenticated ? username : 'user'}
            </button>

            {isOpen && (
                <div className="popover-content">
                    {isAuthenticated ? (
                        <>
                            <p>Hi {username}</p>
                            <Link to="/profile" className="profile-link">Profile</Link>
                            <button className="popover-button" onClick={handleLogout}>Sign Out</button>
                        </>
                    ) : (
                        <button className="popover-button" onClick={() => setIsModalOpen(true)}>
                            Login
                        </button>
                    )}
                </div>
            )}

            {isModalOpen && (
                <LoginModal onClose={() => setIsModalOpen(false)} onLoginSuccess={handleLoginSuccess} />
            )}
        </div>
    );
};

export default UserPopover;