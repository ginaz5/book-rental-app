import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfilePage.css';

// Define the types for the data
interface InventoryItem {
    id: string;
    bookId: string;
    loanDate: string;
}

interface Book {
    id: string;
    title: string;
    author: string;
    image: string;
}

interface UserProfile {
    id: string;
    username: string;
    role: string;
    inventories: InventoryItem[];
}

const ProfilePage: React.FC = () => {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [books, setBooks] = useState<{ [key: string]: Book }>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch the user profile data from the API
    useEffect(() => {
        const fetchUserProfile = async () => {
            const userId = localStorage.getItem('userId');  // Get userId from localStorage

            if (!userId) {
                setError('User not found');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`http://localhost:8080/user/${userId}`);
                setUserProfile(response.data);  // Set the user profile data

                // After getting user profile, fetch book details
                const inventories = response.data.inventories;
                const bookPromises = inventories.map((inventory: InventoryItem) =>
                    axios.get(`http://localhost:8080/books/${inventory.bookId}`)
                );

                const bookResponses = await Promise.all(bookPromises);
                const bookData = bookResponses.reduce((acc: { [key: string]: Book }, curr) => {
                    acc[curr.data.id] = curr.data;
                    return acc;
                }, {});
                setBooks(bookData);  // Store the book details
                setLoading(false);
            } catch (err) {
                setError('Failed to load user profile.');
                setLoading(false);
            }
        };

        fetchUserProfile();  // Fetch profile when component is mounted
    }, []);

    if (loading) {
        return <div>Loading profile...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="profile-page">
            {userProfile && (
                <>
                    <h2>Profile</h2>
                    <div className="profile-info">
                        <p><strong>Name</strong>: {userProfile.username}</p>
                        <p><strong>Role</strong>: {userProfile.role}</p>
                    </div>

                    <div className="borrowed-books-section">
                        <h3>Borrowed Books</h3>
                        <div className="borrowed-books-grid">
                            {userProfile.inventories.length > 0 ? (
                                userProfile.inventories.map((inventory) => (
                                    <div key={inventory.id} className="borrowed-book">
                                        {books[inventory.bookId] && (
                                            <>
                                                <img
                                                    src={books[inventory.bookId].image}
                                                    alt={books[inventory.bookId].title}
                                                    className="book-image"
                                                />
                                                <p><strong>{books[inventory.bookId].title}</strong></p>
                                                <p><strong>Loan Date</strong>: {new Date(inventory.loanDate).toLocaleDateString()}</p>
                                            </>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p>No books borrowed.</p>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProfilePage;