// babel-polyfill provides the runtime that async functions need
//require('babel-polyfill');

// Overrides Node.js's require and compiles modules at runtime
//require('babel-register');

// cpu, memory monitor
//if( process.env.NODE_ENV !== 'production'){
//  const memeye = require('memeye');
//  memeye();
//}

const port = 4000;
const app = require('./app/index');

app.listen(port);
