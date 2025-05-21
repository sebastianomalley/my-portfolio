// app.js

const express = require('express');
const path = require('path');

const app = express();

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Welcome to My Portfolio' });
});

app.get('/projects', (req, res) => {
  res.render('projects', { title: 'Projects' });
});

app.get('/projects/space-game', (req, res) => {
  res.render('projects/space-game', { title: 'APOD + Space Game' });
});

app.get('/projects/nourishmate', (req, res) => {
  res.render('projects/nourishmate', { title: 'Nourishmate' });
});

app.get('/projects/weather-music', (req, res) => {
  res.render('projects/weather-music', { title: 'Weather & Music App' });
});

app.get('/projects/family-wisdom', (req, res) => {
  res.render('projects/family-wisdom', { title: 'Family Wisdom Tips App' });
});

app.get('/projects/ebay-clone', (req, res) => {
  res.render('projects/ebay-clone', { title: 'eBay Clone: After the Fall' });
});

app.get('/projects/cs50-foundations', (req, res) => {
  res.render('projects/cs50-foundations', { title: 'CS50 Foundations' });
});



app.get('/films', (req, res) => {
  res.render('films', { title: 'Film Projects' });
});


app.get('/about', (req, res) => {
  res.render('about', { title: 'About Me' });
});





// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
