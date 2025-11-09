const express = require('express');
const path = require('path');

const app = express();
const PORT = 8386;
const HOST = process.env.HOST || '0.0.0.0';

const publicDir = path.join(__dirname, 'public');
const srcDir = path.join(__dirname, 'src');

app.use(express.static(publicDir));
app.use('/src', express.static(srcDir));

const appRoutes = [
  '/',
  '/trang-chu',
  '/nha-cung-cap',
  '/nha-cung-cap/test',
  '/san-pham',
  '/san-pham/test',
  '/bao-cao',
  '/bao-cao/test',
];

appRoutes.forEach((route) => {
  app.get(route, (_req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
  });
});

app.listen(PORT, HOST, () => {
  console.log(`Frontend available at http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
});

