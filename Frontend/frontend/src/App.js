import React, { useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import './App.css';


function App() {
  const [urls, setUrls] = useState([{ url: "", validity: 30, shortcode: "" }]);
  const [results, setResults] = useState([]);

  const handleChange = (i, field, value) => {
    const newUrls = [...urls];
    newUrls[i][field] = value;
    setUrls(newUrls);
  };

  const addUrl = () => {
    if (urls.length < 5) setUrls([...urls, { url: "", validity: 30, shortcode: "" }]);
  };

  const submit = async () => {
    const responses = [];

    for (let { url, validity, shortcode } of urls) {
      if (!url.startsWith("http")) continue;

      try {
        const res = await axios.post('http://localhost:5000/shorturls', { url, validity, shortcode });
        responses.push(res.data);
      } catch (err) {
        responses.push({ error: err.response?.data?.error || "Failed" });
      }
    }

    setResults(responses);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>URL Shortener</h2>
      {urls.map((u, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <input placeholder="Long URL" value={u.url} onChange={e => handleChange(i, "url", e.target.value)} />
          <input placeholder="Validity (mins)" value={u.validity} type="number" onChange={e => handleChange(i, "validity", e.target.value)} />
          <input placeholder="Shortcode (optional)" value={u.shortcode} onChange={e => handleChange(i, "shortcode", e.target.value)} />
        </div>
      ))}
      <button onClick={addUrl}>+ Add</button>
      <button onClick={submit}>Shorten</button>

      <h3>Results</h3>
      {results.map((r, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          {r.shortLink ? (
            <div>
              <a href={r.shortLink} target="_blank" rel="noreferrer">{r.shortLink}</a><br />
              Expires at: {moment(r.expiry).format("YYYY-MM-DD HH:mm:ss")}
            </div>
          ) : (
            <div style={{ color: 'red' }}>{r.error}</div>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;
