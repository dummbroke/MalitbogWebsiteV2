const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/news/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Helper function to read news data
async function readNewsData() {
    try {
        const data = await fs.readFile(path.join(__dirname, 'news.json'), 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            // If file doesn't exist, create it with empty array
            await fs.writeFile(path.join(__dirname, 'news.json'), JSON.stringify([]));
            return [];
        }
        throw error;
    }
}

// Helper function to write news data
async function writeNewsData(data) {
    await fs.writeFile(path.join(__dirname, 'news.json'), JSON.stringify(data, null, 2));
}

// API Endpoints

// Get all news items
app.get('/api/news', async (req, res) => {
    try {
        const news = await readNewsData();
        res.json(news);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read news data' });
    }
});

// Add new news item
app.post('/api/news', upload.single('image'), async (req, res) => {
    try {
        const news = await readNewsData();
        const newNews = {
            id: Date.now().toString(),
            title: req.body.title,
            date: req.body.date,
            description: req.body.description,
            image: req.file ? `/images/news/${req.file.filename}` : null,
            facebookLink: req.body.facebookLink || null,
            timestamp: new Date().toISOString()
        };

        news.push(newNews);
        await writeNewsData(news);
        res.json(newNews);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add news item' });
    }
});

// Update news item
app.put('/api/news/:id', upload.single('image'), async (req, res) => {
    try {
        const news = await readNewsData();
        const index = news.findIndex(item => item.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'News item not found' });
        }

        const updatedNews = {
            ...news[index],
            title: req.body.title,
            date: req.body.date,
            description: req.body.description,
            facebookLink: req.body.facebookLink || null,
            timestamp: new Date().toISOString()
        };

        if (req.file) {
            updatedNews.image = `/images/news/${req.file.filename}`;
        }

        news[index] = updatedNews;
        await writeNewsData(news);
        res.json(updatedNews);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update news item' });
    }
});

// Delete news item
app.delete('/api/news/:id', async (req, res) => {
    try {
        const news = await readNewsData();
        const filteredNews = news.filter(item => item.id !== req.params.id);
        
        if (filteredNews.length === news.length) {
            return res.status(404).json({ error: 'News item not found' });
        }

        await writeNewsData(filteredNews);
        res.json({ message: 'News item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete news item' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 