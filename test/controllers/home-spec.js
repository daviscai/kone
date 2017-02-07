import path from 'path';
import test from 'ava';
import supertest from 'supertest';

const appDir = path.resolve(__dirname, '../../');

const app = require( appDir + '/app/index').default;

const req = supertest(app.listen());

function get(urlSuffix) {
    return req.get(urlSuffix);
}

test('home index', async () => {
    await get('/home').expect(200);
});

test.only('home i18n', async (t)=>{
    let res = await get('/home/testI18n');
    t.is(res.status, 200, 'testI18n is ok');
    t.is(res.text, 'kwan 基于Koa2构建的Node.js开发框架', 'app.title=基于Koa2构建的Node.js开发框架');

    let res2 = await get('/home/testI18n?locale=en');
    t.is(res2.status, 200, 'testI18n is ok');
    t.is(res2.text, 'kwan is a framework base on Koa2 for node.js', 'app.title=kwan is a framework base on Koa2 for node.js');
});
