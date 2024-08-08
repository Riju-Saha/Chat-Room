const mysql = require('mysql');
const http = require('http');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
// const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
// const io = new Server(server);
// const io = socketIo(server);
const port = 8080;

app.use(cors());
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Your frontend URL
    methods: ["GET", "POST"]
  }
});
app.use(bodyParser.json());
app.use(express.json());

// io.on('connection', (socket) => {
//   console.log(`New client connected: ${socket.id}`);

//   socket.on('disconnect', () => {
//     console.log(`Client disconnected: ${socket.id}`);
//   });
// });

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'chatapp_db'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/auth/register', (req, res) => {
  const { id, username, name, gmail, password, phone } = req.body;
  console.log("Received registration request:", { id, username, name, gmail, password, phone });

  if (!id) {
    return res.status(400).json({ success: false, message: 'Socket ID is required' });
  }

  const sql = "INSERT INTO users (ID, Username, Name, Gmail, Password, Phone) VALUES (?, ?, ?, ?, ?, ?)";
  connection.query(sql, [id, username, name, gmail, password, phone], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    console.log('User registered successfully:', result);
    res.status(200).json({ success: true, message: 'User registered successfully' });
  });
});


app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
  connection.query(sql, [username, password], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    if (result.length > 0) {
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  });
});

app.post('/profile/:username', (req, res) => {
  const { username } = req.params;
  // console.log('Username from URL:', username);

  const sql = "SELECT * FROM users WHERE username = ?";
  connection.query(sql, [username], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    if (result.length > 0) {
      res.status(200).json({ success: true, result });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  });
});




server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
