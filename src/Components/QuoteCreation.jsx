import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const QuoteCreation = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://crafto.app/crafto/v1.0/media/assignment/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Image upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Image upload response:', data);

      if (!data[0].url) {
        throw new Error('Image upload failed: No media URL returned');
      }

      return data[0].url;
    } catch (error) {
      console.error('Error in handleImageUpload:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!image) {
      setError('Please select an image');
      setIsLoading(false);
      return;
    }

    try {
      const mediaUrl = await handleImageUpload(image);
      console.log('Received mediaUrl:', mediaUrl);

      const response = await fetch('https://assignment.stage.crafto.app/postQuote', {
        method: 'POST',
        headers: {
          'Authorization': localStorage.getItem('token') || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, mediaUrl }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create quote: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Quote creation response:', data);

      if (data?.data.id) {
        alert('Quote created successfully!');
        navigate('/quotes');
      } else {
        throw new Error('Failed to create quote: No quote ID returned');
      }
    } catch (error) {
      console.error('Error creating quote:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="quote-creation-container">
      <h2>Create a Quote</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="quote-creation-form">
        <textarea
          placeholder="Enter your quote"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Quote'}
        </button>
      </form>
    </div>
  );
};

export default QuoteCreation;

