import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const QuoteList = () => {
  const [quotes, setQuotes] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchQuotes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://assignment.stage.crafto.app/getQuotes?limit=20&offset=${offset}`, {
        headers: {
          'Authorization': localStorage.getItem('token') || '',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data.data)) {
        if (data?.length === 0) {
          setHasMore(false);
        } else {
          setQuotes((prevQuotes) => [...prevQuotes, ...data.data]);
          setOffset((prevOffset) => prevOffset + data.data.length);
        }
      } else {
        throw new Error('Data is not in the expected format');
      }
    } catch (error) {
      console.error('Error fetching quotes:', error);
      setError('Failed to fetch quotes. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  return (
    <div className="quote-list-container">
      <h2>Quotes</h2>
      {error && <div className="error-message">{error}</div>}
      <div className="quote-list">
        {quotes.map((quote) => (
          <div key={quote.id} className="quote-item">
            <div className="quote-image-container">
              <img src={quote.mediaUrl} alt="Quote" className="quote-image" />
              <div className="quote-text-overlay">{quote.text}</div>
            </div>
            <div className="quote-info">
              <span>{quote.username}</span>
              <span>{new Date(quote.created_at).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
      {isLoading && <div className="loading">Loading...</div>}
      {hasMore && !isLoading && (
        <button onClick={fetchQuotes} className="load-more-button">
          Load More
        </button>
      )}
      <button
        className="floating-action-button"
        onClick={() => navigate('/create-quote')}
      >
        +
      </button>
    </div>
  );
};

export default QuoteList;

