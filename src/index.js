//const fs = require('fs');
global.Promise = require('bluebird')
const path = require('path');
const Kone = require('./core/');
const jsonp = require('./middleware/jsonp');
const router = require('./middleware/router');
const staticServer = require('./middleware/static');
const bodyParser = require('./middleware/bodyparser');
const session = require('./middleware/session');
const i18n = require('./middleware/i18n');
const views = require('./middleware/template');
const cors = require('./middleware/cors');
const csrf = require('./middleware/csrf');
const helmet = require('./middleware/helmet');
const favicon = require('./middleware/favicon');
const uploadFile = require('./middleware/uploadFile');
const redis = require('./middleware/ioredis');
const mongo = require('./middleware/mongo');
const db = require('./middleware/orm');


const appDir = path.resolve(__dirname, '..');
const configDir = path.resolve(__dirname, './config');

// http2 support
// openssl req -newkey rsa:2048 -new -nodes -keyout key.pem -out csr.pem
// openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out server.crt
// const app = new Kone({
//     key: fs.readFileSync(configDir + '/key.pem'),
//     cert: fs.readFileSync(configDir + '/server.crt')
// });

// http only
const app = new Kone();


// bodyparse
app.use(bodyParser());

// i18n
app.use(i18n(app, {
  //defaultLocale: 'zh-cn',
  cookie: 'lang',
  locales: ['zh-cn', 'en'],
  directory: configDir + '/locales'
}));

// views template
app.use(views(appDir + '/app/views', {
  extension: 'tpl',
  map: {
    tpl: 'nunjucks'
  }
}));

//cors Cross-Origin Resource Sharing(CORS) middleware
app.use(cors());

// header secure,  xss core support
app.use(helmet());

// redis
app.use(redis());

// mongodb
app.use(mongo());

// db
app.use(db());

//favicon
app.use(favicon(__dirname + '/../favicon.ico'));

// upload file
app.use(uploadFile({
  uploadDir: appDir + '/uploads/',
  maxFileSize: 2 * 1024 * 1024, // bytes = 2mb default
  keepExtensions: true // default false
}));

// server static file
app.last(staticServer('assets', __dirname + '/../assets/'));

app.last(jsonp());

// session
app.last(session());

//csrf need session middleware, after uploadFile and session middleware
app.last(csrf());

app.last(router());

module.exports = app;
