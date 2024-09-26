import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';  // Import modal component
import './BookDetailPage.css';

// Define the type for the book object
interface Inventory {
    id: string;
    loanDate: string | null;
    bookId: string;
    userId: string | null;  // Assuming userId represents the user name after backend changes
}

interface Book {
    id: string;
    title: string;
    author: string;
    image: string;
    inventories: Inventory[];
}

interface User {
    id: string;
    username: string;
}

const BookDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();  // Get the book ID from the URL
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [backendError, setBackendError] = useState<string | null>(null); // Backend error message
    const [usernamesMap, setUsernamesMap] = useState<Map<string, string>>(new Map());  // Store user IDs to usernames

    const [isActionModalOpen, setIsActionModalOpen] = useState<boolean>(false);  // Action confirmation modal state
    const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);  // Error modal state
    const [modalAction, setModalAction] = useState<string>('');  // Track borrow or return action
    const [currentInventoryId, setCurrentInventoryId] = useState<string>('');  // Track current inventory ID

    // Fetch book details and inventory
    const fetchBookDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/books/${id}`);
            setBook(response.data);  // Set the book details and its inventory
            setLoading(false);

            // Fetch usernames for inventories
            const userIds = response.data.inventories
                .map((inventory: Inventory) => inventory.userId)
                .filter((userId: string | null) => userId !== null);

            const uniqueUserIds = [...new Set(userIds)];  // Get unique user IDs

            // Fetch usernames for unique user IDs
            const usernamesMapTemp = new Map<string, string>();
            await Promise.all(uniqueUserIds.map(async (userId) => {
                const userResponse = await axios.get(`http://localhost:8080/user/${userId}`);
                usernamesMapTemp.set(userId!, userResponse.data.username);  // Populate the map with userId => username
            }));

            setUsernamesMap(usernamesMapTemp);  // Update state with the new map
        } catch (err) {
            setError('Failed to load book details.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookDetails();  // Fetch details when component mounts
    }, [id]);  // Fetch details every time the ID changes

    // Open the action modal with the selected action and inventory ID
    const openActionModal = (action: string, inventoryId: string) => {
        setModalAction(action);  // Either 'borrow' or 'return'
        setCurrentInventoryId(inventoryId);
        setIsActionModalOpen(true);
        setBackendError(null);  // Clear any previous backend error message
    };

    // Close the action modal
    const closeActionModal = () => {
        setIsActionModalOpen(false);
    };

    // Close the error modal
    const closeErrorModal = () => {
        setIsErrorModalOpen(false);
    };

    // Confirm the action (borrow/return) in the action modal
    const handleConfirmAction = async () => {
        const userId = localStorage.getItem('userId');  // Retrieve the user ID from localStorage

        if (!userId) {
            alert('You need to be logged in to perform this action.');
            closeActionModal();
            return;
        }

        try {
            await axios.put(`http://localhost:8080/books/${modalAction}`, {
                inventoryId: currentInventoryId,
                userId,  // Use the stored userId
            });
            fetchBookDetails();  // Refresh the book details and inventory after action
            closeActionModal();  // Close action modal
        } catch (error: any) {
            // Check if the error response exists and has a message from the backend
            if (error.response && error.response.data) {
                setBackendError(error.response.data);  // Capture the backend error message
            } else {
                setBackendError('An unexpected error occurred.');
            }
            closeActionModal();  // Close action modal after error
            setIsErrorModalOpen(true);  // Open error modal
        }
    };

    if (loading) {
        return <div>Loading book details...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="book-detail-page">
            {book && (
                <div className="book-info">
                    <img src={book.image} alt={book.title} className="book-image" />
                    <h2>{book.title}</h2>
                    <h3 className="author-name">By {book.author}</h3>
                </div>
            )}

            <div className="inventory-section">
                <h3>Inventory</h3>
                <table className="inventory-table">
                    <thead>
                    <tr>
                        <th className="id-column">ID</th>
                        <th>User</th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {book?.inventories.map((inventory) => (
                        <tr key={inventory.id}>
                            <td className="id-column">{inventory.id.substring(0, 13)}</td>

                            {/* Show username based on the user ID map */}
                            <td>{inventory.userId ? usernamesMap.get(inventory.userId) : ''}</td>

                            {/* Format date as yyyy/MM, or show nothing */}
                            <td>{inventory.loanDate ? new Date(inventory.loanDate).toLocaleDateString('en-GB', {
                                year: 'numeric',
                                month: '2-digit'
                            }) : ''}</td>

                            <td>
                                {inventory.userId ? (
                                    <button className="return-button" onClick={() => openActionModal('return', inventory.id)}>
                                        Return
                                    </button>
                                ) : (
                                    <button className="borrow-button" onClick={() => openActionModal('borrow', inventory.id)}>
                                        Borrow
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Action Confirmation Modal */}
            <Modal
                isOpen={isActionModalOpen}
                onRequestClose={closeActionModal}
                contentLabel="Confirm Action"
                className="modal-content"
                overlayClassName="modal-overlay"
            >
                <h2>Action</h2>
                <p>{modalAction === 'borrow' ? 'Would you like to borrow this book?' : 'Would you like to return this book?'}</p>
                <button onClick={handleConfirmAction} className="confirm-button">
                    Continue
                </button>
                <button onClick={closeActionModal} className="close-button">
                    Cancel
                </button>
            </Modal>

            {/* Error Modal */}
            <Modal
                isOpen={isErrorModalOpen}
                onRequestClose={closeErrorModal}
                contentLabel="Error Message"
                className="modal-content"
                overlayClassName="modal-overlay"
            >
                {/* Only display the error message from the backend */}
                {backendError && <p style={{ color: 'red' }}>{backendError}</p>}
                <button onClick={closeErrorModal} className="close-button">
                    Close
                </button>
            </Modal>
        </div>
    );
};

export default BookDetailPage;