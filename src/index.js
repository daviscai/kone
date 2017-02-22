const fs  = require('fs');
const path  = require('path');
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
const app = new Kwan({
    key: fs.readFileSync(configDir + '/key.pem'),
    cert: fs.readFileSync(configDir + '/server.crt')
});

// http only
//const app = new Kwan();

app.use(jsonp());  // 9.55

const logDir = path.join(appDir, 'logs'); // 10.33
app.use(logger({
    logDir: logDir,
    logFileName: 'error.log'
}));

// server static file
app.use(staticServer('assets',__dirname + '/../assets/'));  // 13.31

// bodyparse
app.use(bodyParser()); // 15.01

// session
app.use(session()); // 16.53


// i18n
app.use(i18n(app, {  // 17.78
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
app.use(cors());  // 19.06


//csrf need session middleware
app.use(csrf());

// header secure,  xss core support
app.use(helmet());

// favicon
app.use(favicon(__dirname + '/../favicon.ico'));

// monitor

// 模板必须使用 async/await 异步方式
// app.use( async (ctx)=>{
//
//     ctx.session.user = "tom";
//     let sess = ctx.session;
//     console.log(sess);
//     //
//     ctx.log.info(sess);
//     //
//     // //ctx.i18n.setLocale('zh-cn');
//     // let a = ctx.i18n.__('app.title');
//     //
//     // await ctx.render("home/reg.tpl", {title:a});
//
//     ctx.body = ctx.store.get('csrf');
// })

app.use(router());  // 21.98


module.exports = app;
