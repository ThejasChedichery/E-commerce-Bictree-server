# E-Commerce Order Management System

A real-time e-commerce order management system built with Node.js, Express, MongoDB, and Socket.IO. This system provides complete order management functionality with real-time notifications for both users and administrators.

## 🚀 Features

- **User Authentication & Authorization** - JWT-based authentication with role-based access control
- **Product Management** - CRUD operations for products with category support
- **Category Management** - Organize products into categories
- **Order Management** - Place orders, track status, and manage inventory
- **Real-time Notifications** - Socket.IO integration for instant updates
- **Role-based Access** - Separate permissions for users and admins
- **Pagination & Search** - Efficient data retrieval with filtering options

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time Communication**: Socket.IO
- **Security**: bcryptjs for password hashing
- **Environment**: dotenv for configuration

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd E-commerce-Bictree-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   PORT=3001
   MONGO_URL=mongodb://localhost:27017/Bictree-db
   JWT_SECRET=Bictree@2025
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:3001`

## 📁 Project Structure

```
E-commerce-Bictree-server/
├── App/
│   ├── Controller/          # Business logic controllers
│   │   ├── AuthController.js
│   │   ├── CategoryController.js
│   │   ├── NotificationController.js
│   │   ├── OrderController.js
│   │   └── ProductController.js
│   ├── Middleware/          # Custom middleware
│   │   └── validation.js
│   ├── Model/              # Database models
│   │   ├── CategoryModel.js
│   │   ├── NotificationModel.js
│   │   ├── OrderModel.js
│   │   ├── ProductModel.js
│   │   └── UserModel.js
│   ├── Router/             # API routes
│   │   ├── AuthRouter.js
│   │   ├── CategoryRouter.js
│   │   ├── NotificationRouter.js
│   │   ├── OrderRouter.js
│   │   └── ProductRouter.js
│   └── Utilities/          # Utility functions
│       └── database.js
├── server.js               # Main server file
├── package.json
└── README.md
```

## 🔐 Authentication

The system uses JWT-based authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles
- **user**: Can place orders, view their orders and notifications
- **admin**: Full access to all operations including product/category management

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "userName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"  // optional, defaults to "user"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "userName": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "user_id",
    "userName": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "token": "jwt_token_here"
  }
}
```

### Product Endpoints

#### Get All Products
```http
GET /products?page=1&limit=10&search=keyword&subCategory=category_id
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by product name
- `subCategory` (optional): Filter by category ID

**Response:**
```json
{
  "message": "Products fetched successfully",
  "data": [
    {
      "_id": "product_id",
      "name": "Product Name",
      "description": "Product description",
      "price": 99.99,
      "stock": 50,
      "subCategoryId": {
        "_id": "category_id",
        "name": "Category Name"
      },
      "image": "image_url",
      "isActive": true
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

#### Get Product by ID
```http
GET /products/:id
```

#### Create Product (Admin Only)
```http
POST /products
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "New Product",
  "description": "Product description",
  "price": 99.99,
  "stock": 50,
  "subCategoryId": "category_id",
  "image": "image_url"
}
```

**Response:**
```json
{
  "message": "Product added successfully",
  "saveProduct": {
    "_id": "product_id",
    "name": "New Product",
    "description": "Product description",
    "price": 99.99,
    "stock": 50,
    "subCategoryId": "category_id",
    "image": "image_url",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Update Product (Admin Only)
```http
PUT /products/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Updated Product Name",
  "price": 89.99
}
```

#### Delete Product (Admin Only)
```http
DELETE /products/:id
Authorization: Bearer <admin-token>
```

### Category Endpoints

#### Get All Categories
```http
GET /categories
```

#### Get Category by ID
```http
GET /categories/:id
```

#### Create Category (Admin Only)
```http
POST /categories
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Electronics",
  "description": "Electronic products category"
}
```

#### Update Category (Admin Only)
```http
PUT /categories/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Updated Category Name"
}
```

#### Delete Category (Admin Only)
```http
DELETE /categories/:id
Authorization: Bearer <admin-token>
```

### Order Endpoints

#### Place Order
```http
POST /orders
Authorization: Bearer <user-token>
Content-Type: application/json

{
  "products": [
    {
      "productId": "product_id_1",
      "quantity": 2
    },
    {
      "productId": "product_id_2",
      "quantity": 1
    }
  ],
  "shippingAddress": "123 Main St, City, Country"
}
```

**Response:**
```json
{
  "message": "Order placed successfully",
  "order": {
    "_id": "order_id",
    "userId": "user_id",
    "products": [
      {
        "productId": "product_id_1",
        "quantity": 2,
        "price": 99.99
      }
    ],
    "totalPrice": 199.98,
    "status": "pending",
    "shippingAddress": "123 Main St, City, Country"
  }
}
```

#### Get User Orders
```http
GET /orders/user/:userId
Authorization: Bearer <user-token>
```

#### Get All Orders (Admin Only)
```http
GET /orders?page=1&limit=10&status=pending
Authorization: Bearer <admin-token>
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by order status

#### Update Order Status (Admin Only)
```http
PUT /orders/:id/status
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "status": "confirmed"  // pending, confirmed, shipped, delivered, cancelled
}
```

### Notification Endpoints

#### Get User Notifications
```http
GET /notification/user/:userId
Authorization: Bearer <user-token>
```

#### Mark Notification as Read
```http
PUT /notification/read/:id
Authorization: Bearer <user-token>
```

#### Get All Notifications (Admin Only)
```http
GET /notification
Authorization: Bearer <admin-token>
```

## 🔄 Real-time Features (Socket.IO)

The system includes real-time notifications using Socket.IO:

### Client Connection
```javascript
const socket = io('http://localhost:3001');

// Join user room for notifications
socket.emit('join-user-room', userId);

// Join admin room for admin notifications
socket.emit('join-admin-room');
```

### Events

#### For Users:
- `order_status_update`: When order status changes
  ```javascript
  socket.on('order_status_update', (data) => {
    console.log('Order status updated:', data);
  });
  ```

#### For Admins:
- `new_order`: When a new order is placed
  ```javascript
  socket.on('new_order', (data) => {
    console.log('New order received:', data);
  });
  ```

## 📊 Database Models

### User Model
```javascript
{
  userName: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ["user", "admin"], default: "user")
}
```

### Product Model
```javascript
{
  name: String (required),
  description: String,
  price: Number (required),
  stock: Number (required, default: 0),
  subCategoryId: ObjectId (ref: 'categories'),
  image: String,
  isActive: Boolean (default: true)
}
```

### Category Model
```javascript
{
  name: String (required, unique),
  description: String
}
```

### Order Model
```javascript
{
  userId: ObjectId (ref: 'users'),
  products: [{
    productId: ObjectId (ref: 'products'),
    quantity: Number,
    price: Number
  }],
  totalPrice: Number,
  status: String (enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']),
  shippingAddress: String
}
```

### Notification Model
```javascript
{
  userId: ObjectId (ref: 'users'),
  message: String (required),
  type: String (enum: ['order_placed', 'order_status_changed', 'low_stock']),
  isRead: Boolean (default: false),
  orderId: ObjectId (ref: 'orders')
}
```

## 🛡️ Security Features

- **Password Hashing**: Uses bcryptjs for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Different permissions for users and admins
- **Input Validation**: Middleware validation for requests
- **CORS Configuration**: Cross-origin resource sharing setup

## 🚀 Deployment

1. **Environment Variables**: Set up production environment variables
2. **Database**: Configure MongoDB connection string
3. **Security**: Update JWT secret for production
4. **Server**: Deploy to your preferred hosting platform (Heroku, AWS, DigitalOcean, etc.)

## 📝 Error Handling

The API returns consistent error responses:

```json
{
  "message": "Error description",
  "error": "Detailed error information"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Built with ❤️ by the Bictree Development Team**
