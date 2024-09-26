import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './LandingPage.css';

// Define the type for the book object
interface Book {
    id: number;
    title: string;
    author: string;
    image: string;
}

const LandingPage: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get('http://localhost:8080/books');
                setBooks(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load books.');
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    if (loading) {
        return <div className="loading">Loading books...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="landing-page">
            <h2 className="landing-title">Books you might like</h2>

            <div className="books-grid">
                {books.map((book) => (
                    <Link to={`/books/${book.id}`} key={book.id} className="book-card">
                        <img src={book.image} alt={book.title} className="book-image" />
                        <div className="book-info">
                            <h3>{book.title}</h3>
                            <p>{book.author}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default LandingPage;