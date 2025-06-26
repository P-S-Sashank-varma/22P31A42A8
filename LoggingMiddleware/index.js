const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware for logging
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms\n`;
    
    console.log(log);
    fs.appendFileSync('requests.log', log); // Save to file
  });

  next();
});

app.get('/', (req, res) => {
  res.send('Logging Middleware Test');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
