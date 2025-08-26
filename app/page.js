'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './globals.css';

export default function Home() {
  const [plu, setPlu] = useState('');
  const [keyword, setKeyword] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [jsonData, setJsonData] = useState(null);
  const router = useRouter();

  // Effect untuk membaca parameter URL saat halaman dimuat
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const pluParam = urlParams.get('plu');
      const keywordParam = urlParams.get('keyword');
      
      if (pluParam) {
        setPlu(pluParam);
        fetchImage(pluParam);
      }
      
      if (keywordParam) {
        setKeyword(keywordParam);
        fetchSearch(keywordParam);
      }
    }
  }, []);

  const handleImageSubmit = (e) => {
    e.preventDefault();
    if (plu) {
      router.push(`/?plu=${plu}`);
      fetchImage(plu);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (keyword) {
      router.push(`/?keyword=${keyword}`);
      fetchSearch(keyword);
    }
  };

  const fetchImage = async (pluValue) => {
    setLoading(true);
    setError('');
    setJsonData(null);
    try {
      const response = await fetch(`/api/image/${pluValue}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setImageUrl(data.image_url);
      } else {
        setError(data.message || 'Failed to fetch image');
      }
    } catch (err) {
      setError('An error occurred while fetching the image');
    } finally {
      setLoading(false);
    }
  };

  const fetchSearch = async (keywordValue) => {
    setLoading(true);
    setError('');
    setImageUrl('');
    try {
      const response = await fetch(`/api/search/${encodeURIComponent(keywordValue)}`);
      const data = await response.json();
      
      if (data.status === '00') {
        setJsonData(data);
      } else {
        setError(data.message || 'Failed to fetch search results');
      }
    } catch (err) {
      setError('An error occurred while fetching search results');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>KlikIndomaret API Viewer</h1>
      
      <div className="section">
        <h2>Get Image by PLU</h2>
        <form onSubmit={handleImageSubmit} className="search-form">
          <input
            type="text"
            value={plu}
            onChange={(e) => setPlu(e.target.value)}
            placeholder="Enter PLU code (e.g., 20087542)"
            required
          />
          <button type="submit">Load Image</button>
        </form>
      </div>
      
      <div className="section">
        <h2>Search Products</h2>
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter keyword (e.g., Golda)"
            required
          />
          <button type="submit">Search</button>
        </form>
      </div>

      {loading && <p className="loading">Loading...</p>}
      
      {error && <p className="error">Error: {error}</p>}
      
      {imageUrl && !loading && (
        <div className="result-section">
          <h2>Image Result</h2>
          <div className="image-container">
            <img
              src={imageUrl}
              alt={`Product ${plu}`}
              width={300}
              height={300}
              style={{ objectFit: 'contain' }}
            />
            <p className="image-url">
              Image URL: <a href={imageUrl} target="_blank" rel="noopener noreferrer">{imageUrl}</a>
            </p>
          </div>
        </div>
      )}
      
      {jsonData && !loading && (
        <div className="result-section">
          <h2>Search Results</h2>
          <div className="json-container">
            <pre>{JSON.stringify(jsonData, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
