# Smart City Issue Reporter - Backend Setup

## Prerequisites
- Node.js (v14+)
- MySQL Server running locally
- Database: `smart_city_db` (will be auto-created by the server)

## Setup Steps

### 1. Install Node Dependencies
```bash
cd "c:\Users\moham\OneDrive\Desktop\prototype 1.2 .5"
npm install
```

### 2. Ensure MySQL is Running
- Start MySQL Server (Windows: Services → MySQL80, or run `mysqld`)
- Default credentials: `root` / `dlab` (as provided)

### 3. Start the Backend Server
```bash
npm start
```
You should see:
```
Server running on http://localhost:3000
Database initialized successfully
```

### 4. Open the App
- Once the server is running, open `index.html` in your browser:
  - File path: `c:\Users\moham\OneDrive\Desktop\prototype 1.2 .5\index.html`
  - Or open: `http://localhost:3000` in a browser

## Signup Flow
1. On the login screen, fill in **Email** and **Password**.
2. Click the **Sign up** button.
3. On success, you'll be logged in and redirected to the home screen.
4. On error (e.g., email already exists), an error message appears.

## Test Credentials
After first signup, you can use those same credentials to log in.

Default admin account (if manually added):
- Email: `admin@smartcity.com`
- Password: `admin123`

## Troubleshooting

### "Connection refused" or "Cannot connect to database"
- Ensure MySQL is running: `mysql -u root -p` (password: `dlab`)
- If not installed, install from https://dev.mysql.com/downloads/mysql/

### "npm ERR! code ENOENT"
- Run `npm install` first to install dependencies.

### Signup not working
- Check console logs in the browser (F12 → Console).
- Check server terminal for error messages.

## API Endpoints
- **GET `/api/storage/:key`** – Retrieve a storage value
- **POST `/api/storage/:key`** – Save a storage value
- **DELETE `/api/storage/:key`** – Delete a storage value
