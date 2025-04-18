const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(express.static(path.join(__dirname)));
app.use(express.static(path.join(__dirname, 'pages')));
app.use(express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'js')));
app.use(express.static(path.join(__dirname, 'images')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API Routes
app.get('/api/data', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/websiteData.json'), 'utf8'));
    res.json(data);
  } catch (error) {
    console.error('Error reading data file:', error);
    res.status(500).json({ error: 'Error reading data file' });
  }
});

// News API
app.get('/api/news', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/websiteData.json'), 'utf8'));
    console.log('Sending news data:', data.news.latest);
    res.json(data.news.latest);
  } catch (error) {
    console.error('Error reading news data:', error);
    res.status(500).json({ error: 'Error reading news data' });
  }
});

// Add News API
app.post('/api/news', (req, res) => {
  try {
    const newNews = req.body;
    
    // Validate required fields
    if (!newNews.title || !newNews.date || !newNews.description || !newNews.image) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Read existing data
    const dataPath = path.join(__dirname, 'data/websiteData.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    // Generate new ID
    const newId = data.news.latest.length > 0 
      ? Math.max(...data.news.latest.map(item => item.id)) + 1 
      : 1;

    // Add new news item
    data.news.latest.unshift({
      id: newId,
      ...newNews
    });

    // Write back to file
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

    res.status(201).json({ message: 'News article added successfully', id: newId });
  } catch (error) {
    console.error('Error adding news:', error);
    res.status(500).json({ error: 'Error adding news article' });
  }
});

// Update News API
app.put('/api/news/:id', (req, res) => {
  try {
    const newsId = parseInt(req.params.id);
    const updatedNews = req.body;
    
    // Validate required fields
    if (!updatedNews.title || !updatedNews.date || !updatedNews.description || !updatedNews.image) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Read existing data
    const dataPath = path.join(__dirname, 'data/websiteData.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    // Find the news article
    const newsIndex = data.news.latest.findIndex(item => item.id === newsId);
    if (newsIndex === -1) {
      return res.status(404).json({ error: 'News article not found' });
    }

    // Update the news article
    data.news.latest[newsIndex] = {
      id: newsId,
      ...updatedNews
    };

    // Write back to file
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

    res.json({ message: 'News article updated successfully' });
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({ error: 'Error updating news article' });
  }
});

// Delete News API
app.delete('/api/news/:id', (req, res) => {
  try {
    const newsId = parseInt(req.params.id);

    // Read existing data
    const dataPath = path.join(__dirname, 'data/websiteData.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    // Find and remove the news article
    const newsIndex = data.news.latest.findIndex(item => item.id === newsId);
    if (newsIndex === -1) {
      return res.status(404).json({ error: 'News article not found' });
    }

    // Remove the article
    data.news.latest.splice(newsIndex, 1);

    // Write back to file
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

    res.json({ message: 'News article deleted successfully' });
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({ error: 'Error deleting news article' });
  }
});

// Tourism API
app.get('/api/tourism', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/websiteData.json'), 'utf8'));
    res.json(data.tourism);
  } catch (error) {
    res.status(500).json({ error: 'Error reading tourism data' });
  }
});

// Departments API
app.get('/api/departments', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/websiteData.json'), 'utf8'));
    res.json(data.departments);
  } catch (error) {
    res.status(500).json({ error: 'Error reading departments data' });
  }
});

// Error Handling Middleware
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'pages/404.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).sendFile(path.join(__dirname, 'pages/404.html'));
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});