import React from 'react';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import LandingPage from './components/landing-page/LandingPage.tsx';
import BookDetailPage from './components/book-detail/BookDetailPage.tsx';
import LoginPage from './components/login/LoginPage.tsx';
import UserPopover from './components/user-popover/UserPopover.tsx';
import ProfilePage from "./components/profile-page/ProfilePage.tsx";

const App: React.FC = () => {
    return (
        <Router>
            <header className="landing-header">
                <div className="header-left">
                    <Link to="/" className="brand-link"> {/* Use Link to wrap "Book Rental" */}
                        Book Rental
                    </Link>
                </div>
                <div className="header-right">
                    <UserPopover/> {/* This will be available on every route */}
                </div>
            </header>
            <Routes>
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/books/:id" element={<BookDetailPage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/profile" element={<ProfilePage/>}/>
            </Routes>
        </Router>
    );
};

export default App;