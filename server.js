const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var cors = require('cors')
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from public directory
app.use(cors())
// MongoDB connection
mongoose.connect('mongodb://localhost:27017/carService', { useNewUrlParser: true, useUnifiedTopology: true });

// User schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Service schema
const serviceSchema = new mongoose.Schema({
    name: String,
    description: String,
    location: String,
    phone: String,
});

const Service = mongoose.model('Service', serviceSchema);

// Signup endpoint
app.post('/api/signup', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(400).json({ message: 'Error registering user.' });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    
    if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ id: user._id }, '1bb90465ebc73dfe89a21a89e673f76f76c8ca2787edd6566bb82435663e283e23e7f86f13a68c66a55efe268935344bd8742810cc01593f3d7736bd9e0631c3')
        res.json({ success: true, token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});
// Register Service endpoint
app.post('/api/services', async (req, res) => {
    const { name, description, location, phone } = req.body;
    const service = new Service({ name, description, location, phone });
    
    try {
        await service.save();
        res.json({ message: 'Service registered successfully!' });
    } catch (error) {
        res.status(400).json({ message: 'Error registering service.' });
    }
});

// Get Services endpoint
app.get('/api/services', async (req, res) => {
    const services = await Service.find();
    res.json(services);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
