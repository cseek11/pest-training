const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

const DATA_PATH = path.join(__dirname, 'training-content.json');

if (!fs.existsSync(DATA_PATH)) {
  fs.writeFileSync(DATA_PATH, JSON.stringify({ core_exam:[], categories:{}, flashcards:[], links:{} }, null, 2));
}

app.get('/api/content', (req, res) => {
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf8');
    res.type('application/json').send(raw);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to read content' });
  }
});

app.post('/api/content', (req, res) => {
  try {
    fs.writeFileSync(DATA_PATH, JSON.stringify(req.body, null, 2));
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to write content' });
  }
});

app.get('/api/health', (req,res)=>res.json({ ok:true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log('Backend listening on port', PORT);
});
