const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const log = require('../LoggingMiddleware/logger');

const app = express();
app.use(cors());
app.use(express.json());

const db = {}; 

const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzYXNoYW5rdmFybWE5MjBAZ21haWwuY29tIiwiZXhwIjoxNzUwOTIwNjU2LCJpYXQiOjE3NTA5MTk3NTYsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI2NDIyOTUzNS04N2E1LTQ3MjctYjFjMi1mMGI4MWQwNDlkYzAiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJwIHMgc2FzaGFuayB2YXJuYSIsInN1YiI6IjkyZDdjZGMxLThkOWUtNDA1YS1hM2U2LTYzNjAzMWY3ZTBmNiJ9LCJlbWFpbCI6InNhc2hhbmt2YXJtYTkyMEBnbWFpbC5jb20iLCJuYW1lIjoicCBzIHNhc2hhbmsgdmFybmEiLCJyb2xsTm8iOiIyMnAzMWE0MmE4IiwiYWNjZXNzQ29kZSI6Ik5Gd2dSVCIsImNsaWVudElEIjoiOTJkN2NkYzEtOGQ5ZS00MDVhLWEzZTYtNjM2MDMxZjdlMGY2IiwiY2xpZW50U2VjcmV0IjoiaHNUdFlhRUVnQWt6ck15YSJ9.Dv81sYbqnspjBz5XBSyrnk4F9La46zJjarMnqvHfO10'; 


app.post('/shorturls', async (req, res) => {
  const { url, validity = 30, shortcode } = req.body;

  if (!url || !url.startsWith('http')) {
    await log("backend", "error", "handler", "Invalid URL", ACCESS_TOKEN);
    return res.status(400).json({ error: "Invalid URL" });
  }

  const code = shortcode || uuidv4().slice(0, 6);
  const expiry = moment().add(validity, 'minutes');

  if (db[code]) {
    await log("backend", "error", "handler", "Shortcode collision", ACCESS_TOKEN);
    return res.status(409).json({ error: "Shortcode already exists" });
  }

  db[code] = {
    url,
    createdAt: new Date(),
    expiry: expiry.toISOString(),
    clicks: 0
  };

  await log("backend", "info", "handler", `Shortcode ${code} created`, ACCESS_TOKEN);
  res.status(201).json({ shortLink: `http://localhost:5000/${code}`, expiry: expiry.toISOString() });
});


app.get('/:code', async (req, res) => {
  const record = db[req.params.code];

  if (!record) return res.status(404).json({ error: "Not found" });

  const now = moment();
  if (now.isAfter(record.expiry)) return res.status(410).json({ error: "Expired" });

  record.clicks++;
  res.redirect(record.url);
});


app.get('/shorturls/:code', async (req, res) => {
  const record = db[req.params.code];

  if (!record) return res.status(404).json({ error: "Not found" });

  res.json({
    originalUrl: record.url,
    createdAt: record.createdAt,
    expiry: record.expiry,
    clicks: record.clicks
  });
});

app.listen(5000, () => console.log('Backend running on http://localhost:5000'));
