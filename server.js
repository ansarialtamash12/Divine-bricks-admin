// server.js
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const app = next({ dev: false }); // use production mode
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(process.env.PORT || 3000); // IIS will pass port
});
