const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const connectDataBase = require('./App/Utilities/database');

// Import Routes
const authRoutes = require('./App/Router/AuthRouter');
const productRoutes = require('./App/Router/ProductRouter');
const categoryRoutes = require('./App/Router/CategoryRouter');
const orderRoutes = require('./App/Router/OrderRouter');
const notificationRoutes = require('./App/Router/NotificationRouter')

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    credentials: true,
  }
});

app.use(cors());
app.use(express.json());

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Connect to Database
connectDataBase();

// Routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/orders', orderRoutes);
app.use('/notification',notificationRoutes)

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  socket.on('join-user-room', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined their room`);
  });
  
  socket.on('join-admin-room', () => {
    socket.join('admin_room');
    console.log('Admin joined admin room');
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'E-Commerce Order Management API is running!' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});