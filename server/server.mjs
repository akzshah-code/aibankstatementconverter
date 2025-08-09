// server/server.mjs

import { execSync } from 'child_process';
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/unlock', upload.single('pdf'), (req, res) => {
  const password = req.body.password;
  const inputPath = req.file.path;
  const outputPath = path.join('uploads', `unlocked_${req.file.originalname}`);

  try {
    execSync(`qpdf --password=${password} --decrypt "${inputPath}" "${outputPath}"`);
    res.download(outputPath, 'unlocked.pdf');
  } catch (err) {
    console.error('Unlock failed:', err);
    res.status(500).json({ error: 'Unlock failed. Try the Secure Workaround.' });
  }
});

app.get('/', (req, res) => {
  res.send('Server is running and ready to unlock PDFs.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
