# TodoList Application

A full-stack TodoList application built with Vue 3, Node.js, and MySQL.

## Features

- ✅ User authentication (register/login)
- 📝 Create, read, update, and delete todos
- 🎯 Mark todos as completed/pending
- 🔍 Filter todos (all, pending, completed)
- 📱 Responsive design
- 🎨 Modern UI with gradient backgrounds
- 💾 Real-time updates
- 🔐 JWT-based authentication

## Tech Stack

### Frontend
- Vue 3 (Composition API)
- Vue Router
- Pinia (State Management)
- Axios (HTTP Client)
- Vite (Build Tool)

### Backend
- Node.js
- Express.js
- MySQL 2
- JWT (JSON Web Tokens)
- BcryptJS (Password Hashing)
- CORS
- Dotenv

## Project Structure

```
todolist/
├── backend/
│   ├── routes/
│   │   ├── auth.js
│   │   └── todos.js
│   ├── middleware/
│   │   └── auth.js
│   ├── db.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── TodoItem.vue
│   │   ├── views/
│   │   │   ├── Home.vue
│   │   │   ├── Login.vue
│   │   │   └── Register.vue
│   │   ├── stores/
│   │   │   ├── auth.js
│   │   │   └── todos.js
│   │   ├── router/
│   │   │   └── index.js
│   │   ├── App.vue
│   │   └── main.js
│   ├── public/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE todolist;
```

2. Update the `.env` file in the backend directory with your MySQL credentials:
```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=todolist
DB_PORT=3306
JWT_SECRET=your_jwt_secret_key_here
PORT=3000
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The API will be running on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be running on `http://localhost:5173`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Todos (Requires Authentication)

- `GET /api/todos` - Get all todos for the authenticated user
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## Default Admin User

After setting up the application, you can register a new user through the registration form.

## Environment Variables

### Backend (.env)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=todolist
DB_PORT=3306
JWT_SECRET=your_jwt_secret_key_here
PORT=3000
```

### Frontend (vite.config.js)
The frontend is configured to proxy API requests to the backend during development.

## Security Features

- Password hashing with BcryptJS
- JWT-based authentication
- CORS enabled
- Input validation
- SQL injection protection with prepared statements

## Development Scripts

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## License

MIT License

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Create a pull request