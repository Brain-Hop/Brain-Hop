
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Middleware to log every incoming request
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Defines a GET endpoint to send a test message to the frontend.
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// Starts the Express server and logs the port it's running on.
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// get a message and send response from ai 
app.post('/api/ai-message', (req, res) => {
  const userMessage = req.body.message;

  // Simulate AI response (replace with actual AI integration)
  const aiResponse = `Message received: ${userMessage}`;

  res.json({ response: aiResponse });
}); 