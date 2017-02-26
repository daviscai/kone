//const fs = require('fs');
const path = require('path');
const Kone = require('./core/');
const jsonp = require('./middleware/jsonp');
const router = require('./middleware/router');
const logger = require('./middleware/logger');
const staticServer = require('./middleware/static');
const bodyParser = require('trek-body-parser');
const session = require('./middleware/session');
const i18n = require('./middleware/i18n');
const views = require('./middleware/template');
const cors = require('./middleware/cors');
const csrf = require('./middleware/csrf');
const helmet = require('./middleware/helmet');
const favicon = require('./middleware/favicon');



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

app.last(jsonp());


const logDir = path.join(appDir, 'logs');
app.use(logger({
    logDir: logDir,
    logFileName: 'error.log'
}));

// server static file
app.last(staticServer('assets',__dirname + '/../assets/'));

// bodyparse
app.use(bodyParser());

// session
app.use(session());


// i18n
app.use(i18n(app, {
    //defaultLocale: 'zh-cn',
    cookie: 'lang',
    locales:['zh-cn', 'en'],
    directory: configDir + '/locales'
}));


// views template
app.use(views(__dirname + '/views', {
    extension: 'tpl',
    map: {
        tpl: 'nunjucks'
    }
}));

//cors Cross-Origin Resource Sharing(CORS) middleware
app.use(cors());


//csrf need session middleware
app.use(csrf());

// header secure,  xss core support
app.use(helmet());

// favicon
app.use(favicon(__dirname + '/../favicon.ico'));

// monitor

app.use(router());


module.exports = app;
