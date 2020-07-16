//Banco de dados (chave-valor)
const express = require('express');
const DBFactory = require('./db');


const app = express();
app.use(express.json());

app.use(function (req, res, next) {
  res.removeHeader("X-Powered-By");
  next();
});

const db = DBFactory();

// GET /api/data/ -> Lista (chave)
app.get('/api/data/', (_, res) => {
  res.statusCode = 200;
  return res.end(JSON.stringify(db.getItems().map(pair => pair.key)));
});

// GET /api/data/:key -> Pair (valor)
app.get('/api/data/:key', (req, res) => {
  const key = req.params.key;

  if (!key) {
    res.statusCode = 400;
    return res.end(`Bad Request. Parameter 'key' is required.`);
  }

  const exists = db.contains(key);

  if (!exists) {
    res.statusCode = 404;
    return res.end(`No object found with key: ${key}.`);
  }

  res.statusCode = 200;
  return res.end(JSON.stringify(db.getValue(key)));
});

// POST /api/data/ -> Insere -> {"key":"chave", "value":"valor"}
app.post('/api/data/', (req, res) => {
  const { key, value } = req.body;
  if (!req.body || !key || !value) {
    res.statusCode = 400;
    return res.end('Request body must contain an object with key and value properties');
  }

  const exists = db.contains(key);
  if (exists) {
    res.statusCode = 409;
    return res.end('An object has been found with same key. Are you trying to overwrite? use PUT.');
  }

  db.add({ key, value });
  res.statusCode = 201;
  return res.end('Created');
});

// PUT /api/data/:key -> Alterar -> {"key":"chave", "value":"valor"}
app.put('/api/data/:key', (req, res) => {
  const pkey = req.params.key;

  if (!pkey) {
    res.statusCode = 400;
    return res.end(`Bad Request. Parameter 'key' is required.`);
  }

  const { key, value } = req.body;
  if (!req.body || !key || !value || pkey !== key) {
    res.statusCode = 400;
    return res.end('Request body must contain an object with key (must be equal to url parameter) and value properties');
  }

  const exists = db.contains(pkey);

  if (!exists) {
    res.statusCode = 404;
    return res.end(`No object found with key: ${pkey}.`);
  }

  db.alter(pkey, { key, value });
  res.statusCode = 200;
  res.end('Altered');
});

// DELETE /api/data/:key -> Remover -> 
app.delete('/api/data/:key', (req, res) => {
  const key = req.params.key;

  if (!key) {
    res.statusCode = 400;
    return res.end(`Bad Request. Parameter 'key' is required.`);
  }

  const exists = db.contains(key);

  if (!exists) {
    res.statusCode = 404;
    return res.end(`No object found with key: ${key}.`);
  }

  db.remove(key);
  res.statusCode = 200;
  return res.end('removed');
});


app.listen(8080, () => { console.log('listening on localhost:8080') });