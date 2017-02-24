const fs = require('fs');
const request = require('request');
const path = require('path');
const Kwan = require('./core/');
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
// const app = new Kwan({
//     key: fs.readFileSync(configDir + '/key.pem'),
//     cert: fs.readFileSync(configDir + '/server.crt')
// });

// http only
const app = new Kwan(); // 7.33 - 7.96

app.last(jsonp());  // 7.96 - 8.51 | 9.9 - 10.32


const logDir = path.join(appDir, 'logs'); // 10.13 ~ 10.91
app.use(logger({
    logDir: logDir,
    logFileName: 'error.log'
}));

// server static file
app.last(staticServer('assets',__dirname + '/../assets/'));  // 10.01 ~ 10.44

// bodyparse
app.use(bodyParser()); // 8.63 ~ 9.27

// session
app.use(session()); //13.66 ~ 15.41  7.73 ~ 9.33


// i18n
app.use(i18n(app, {  // 9.44 ~ 9.94
    //defaultLocale: 'zh-cn',
    cookie: 'lang',
    locales:['zh-cn', 'en'],
    directory: configDir + '/locales'
}));


// views template
app.use(views(__dirname + '/views', {  // 18.22
    extension: 'tpl',
    map: {
        tpl: 'nunjucks'
    }
}));

//cors Cross-Origin Resource Sharing(CORS) middleware
app.use(cors());  // 8.82 ~ 9.73


//csrf need session middleware
app.use(csrf());  // 12.5 ~ 13.83

// header secure,  xss core support
app.use(helmet());  // 11.57 ~ 12.8

// favicon
app.use(favicon(__dirname + '/../favicon.ico'));  // 9.91 ~ 10.62

// monitor

// 模板必须使用 async/await 异步方式
app.use(async(ctx) => {  // 28.2 ~ 30.88  | with template , 98.13 ~ 105

    ctx.session.user = "tom3";
    let sess = ctx.session;
    // console.log(sess);
    // //
    ctx.log.info('abc');
    // //
    // // //ctx.i18n.setLocale('zh-cn');
    let a = ctx.i18n.__('app.title');
    //
    await ctx.render("home/reg.tpl", {title:a});
    // ctx.store.get('csrf');

    //ctx.body = 'aaa';
    //ctx.status = 200;
})

//app.use(router());  // 21.98


module.exports = app;
