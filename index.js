// babel-polyfill provides the runtime that async functions need
require('babel-polyfill');

// Overrides Node.js's require and compiles modules at runtime
require('babel-register');

const port = 4000;
const app = require('./app/index').default;

app.listen(port);

// app.listen(port, () => console.log(`Listening on port ${port}.`));
