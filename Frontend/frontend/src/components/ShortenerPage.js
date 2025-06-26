import React, { useState } from 'react';
import axios from 'axios';
import log from '../LoggingMiddleware/logger';
import './ShortenerPage.css'; // ✅ Import the CSS file

const ShortenerPage = () => {
  const [longUrl, setLongUrl] = useState('');
  const [validity, setValidity] = useState(30);
  const [shortcode, setShortcode] = useState('');
  const [results, setResults] = useState([]);

  const handleShorten = async () => {
    try {
      const response = await axios.post('http://localhost:5000/shorturls', {
        url: longUrl,
        validity,
        shortcode: shortcode || undefined,
      });

      const { shortLink, expiry } = response.data;

      await log("frontend", "info", "component", `Shortened URL: ${shortLink}`);

      setResults([...results, { shortLink, expiry }]);
      setLongUrl('');
      setValidity(30);
      setShortcode('');
    } catch (err) {
      await log("frontend", "error", "component", err.response?.data?.error || "Unknown error");
      alert(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="container">
      <h1>🔗 URL Shortener</h1>
      <div className="form">
        <input
          type="text"
          placeholder="Enter long URL"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
        />
        <input
          type="number"
          placeholder="Validity in minutes"
          value={validity}
          onChange={(e) => setValidity(Number(e.target.value))}
        />
        <input
          type="text"
          placeholder="Custom shortcode (optional)"
          value={shortcode}
          onChange={(e) => setShortcode(e.target.value)}
        />
        <button onClick={handleShorten}>+ Add Shorten</button>
      </div>

      <div className="results">
        <h2>Results</h2>
        {results.map((item, index) => (
          <div key={index} className="card">
            <p><strong>🔗 Short Link:</strong> <a href={item.shortLink} target="_blank" rel="noreferrer">{item.shortLink}</a></p>
            <p><strong>⏳ Expires at:</strong> {new Date(item.expiry).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShortenerPage;
