import 'babel-polyfill';
import path from 'path';
import express from 'express';
import { port } from './../config/config';
import renderOnServer from './renderOnServer';

const server = global.server = express();

server.use(function (req, res, next) {
  const time = ((d = new Date()) =>
    `[${d.getHours()}:${d.getUTCMinutes()}:${d.getUTCSeconds()}.${d.getMilliseconds()}]`)();
  console.log(time + ' ' + req.originalUrl);
  next();
});

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
server.use(express.static(path.join(__dirname, 'public')));

//
// Register API middleware
// -----------------------------------------------------------------------------
// server.use('/api/content', require('./api/content'));

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
server.get('/*', async (req, res, next) => {
  renderOnServer(req, res, next);
});

//
// Launch the server
// -----------------------------------------------------------------------------
server.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`The server is running at http://localhost:${port}/`);
});
