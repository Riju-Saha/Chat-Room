const mysql = require('mysql')
const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;

// middlewares
// app.use(cors({
//   origin: 'http://localhost:3000', // Adjust the origin to match your frontend URL
//   methods: 'GET,POST',
//   credentials: true
// }));
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());


var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'chatapp_db'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});

app.get('/', (req, res) => {
  res.send('Hello World');
})

app.post('/auth/register', (req, res) => {
  const { username, name, gmail, password, phone } = req.body;
  console.log("Received registration request:", { username, name, gmail, password, phone });

  const sql = "INSERT INTO users (Username, Name, Gmail, Password, Phone) VALUES (?, ?, ?, ?, ?)";
  connection.query(sql, [username, name, gmail, password, phone], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).json({ success: false, message: 'Database error' });
      return;
    }

    console.log('User registered successfully:', result);
    res.status(200).json({ success: true, message: 'User registered successfully' });
  });
});


// app.post('/auth/login', (req, res) => {
//   const { username, password } = req.body;
//   // console.log("username is: ", username)
//   // console.log("password is: ", password)
//   const sql = "SELECT * FROM user WHERE username = ? AND password = ?";
//   connection.query(sql, [username, password], (err, result) => {
//     if (err) {
//       console.error('Database error:', err);
//       res.status(500).json({ success: false, message: 'Database error' });
//       return;
//     }
//     if (result.length > 0) {
//       res.status(200).json({ success: true });
//     } else {
//       res.status(401).json({ success: false, message: 'Invalid credentials' });
//     }
//   });
// });

app.listen(port);