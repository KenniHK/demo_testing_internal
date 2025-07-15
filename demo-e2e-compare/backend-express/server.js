import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Dummy user login data
const USERS = [
  { username: 'admin', password: '12345', token: 'abc123token' }
];

// Dummy data toko
const TOKO_LIST = [
  { id: 1, name: 'Toko Alpha', city: 'Jakarta', status: 'Aktif' },
  { id: 2, name: 'Toko Beta', city: 'Bandung', status: 'Tidak Aktif' },
  { id: 3, name: 'Toko Gamma', city: 'Surabaya', status: 'Aktif' }
];

app.use(cors());
app.use(express.json());

// Login Endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: 'Login gagal' });
  res.json({ token: user.token });
});

// Endpoint Toko
app.get('/api/toko', (req, res) => {
  const token = req.headers.authorization;
  if (token !== 'Bearer abc123token') return res.status(403).json({ message: 'Unauthorized' });
  res.json({ data: TOKO_LIST });
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
