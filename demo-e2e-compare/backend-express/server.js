import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import  path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Dummy user login data
const USERS = [
  { username: 'admin', password: '12345', token: 'abc123token' }
];

// Dummy data toko
let TOKO_LIST = [
  { id: 1, name: 'Toko Alpha', city: 'Jakarta', status: 'Aktif' },
  { id: 2, name: 'Toko Beta', city: 'Bandung', status: 'Tidak Aktif' },
  { id: 3, name: 'Toko Gamma', city: 'Surabaya', status: 'Aktif' }
];

let tokoIdCounter  = 4;

app.use(cors());
app.use('/screenshots', express.static(path.join(__dirname, '..', 'screenshots')));
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

app.post('/api/toko', (req, res) => {
  const { name, city, status } = req.body;
  const newToko = { id: tokoIdCounter++, name, city, status };
  TOKO_LIST.push(newToko);
  res.status(201).json(newToko);
});

app.put('/api/toko/:id', (req, res) => {
  const id = +req.params.id;
  const toko = TOKO_LIST.find(t => t.id === id);
  if (!toko) return res.status(404).json({ message: 'Toko tidak ditemukan' });
  Object.assign(toko, req.body);
  res.json(toko);
});

app.delete('/api/toko/:id', (req, res) => {
  const id = +req.params.id;
  TOKO_LIST = TOKO_LIST.filter(t => t.id !== id);
  res.status(204).send();
});

// Run test script via ?tool=selenium|playwright
app.get('/run-test', (req, res) => {
  const tool = req.query.tool;
  if (!['selenium', 'playwright'].includes(tool)) {
    return res.status(400).json({ message: 'Tool tidak valid' });
  }

  const scriptPath = path.join(__dirname, '..', 'tests', `${tool}-test.js`);
  const start = Date.now();

  exec(`node ${scriptPath}`, (error, stdout, stderr) => {
    const duration = (Date.now() - start) / 1000;
    if (error) {
      console.error(`Error during ${tool} test:`, stderr);
      return res.status(500).json({
        tool,
        success: false,
        error: stderr,
        duration
      });
    }

    return res.json({
      tool,
      success: true,
      log: stdout,
      screenshot: `/screenshots/hasil-${tool}.png`,
      duration
    });
  });
});

app.get('/run-test-login', (req, res) => {
  const tool = req.query.tool;
  const script = path.join(__dirname, '..', 'tests', `${tool}-test-login.js`); // bukan .mjs
  const start = Date.now();

  const command = `node "${script}"`;

  console.log(`▶️ Menjalankan perintah: ${command}`);

  exec(command, (error, stdout, stderr) => {
    const duration = ((Date.now() - start) / 1000).toFixed(2);
    if (error) {
      console.error(`❌ Error running ${tool} login test:`, stderr || error.message);
      return res.status(500).json({
        tool,
        success: false,
        duration,
        log: `❌ Gagal login test\n${stderr || error.message}`
      });
    }

    res.json({
      tool,
      success: true,
      duration,
      log: stdout,
      screenshot: `/screenshots/${tool}-login.png`
    });
  });
});



// Run CRUD test
app.get('/run-test-crud', (req, res) => {
  const script = path.join(__dirname, '..', 'tests', 'playwright-testing-crud.spec.js');
  const start = Date.now();

  const command = `npx playwright test playwright-testing-crud.spec.js`;

  console.log(`▶️ Menjalankan perintah: ${command}`);

  exec(command, (error, stdout, stderr) => {
    const duration = ((Date.now() - start) / 1000).toFixed(2);
    if (error) {
      console.error(`❌ Error running CRUD test:`, stderr || error.message);
      return res.status(500).json({
        tool: 'playwright',
        success: false,
        duration,
        log: `❌ Gagal test CRUD\n${stderr || error.message}`
      });
    }

    res.json({
      tool: 'playwright',
      success: true,
      duration,
      log: stdout,
      screenshot: `/screenshots/playwright-crud.png`
    });
  });
});


app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
