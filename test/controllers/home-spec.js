import path from 'path';
import test from 'ava';
import supertest from 'supertest';

const appDir = path.resolve(__dirname, '../../');

const app = require(appDir + '/app/index');

const req = supertest(app.listen());

function get(urlSuffix) {
  return req.get(urlSuffix);
}

test('home index', async() => {
  await get('/home').expect(200);
});

test.only('home i18n', async(t) => {
  let res = await get('/home/testI18n');
  t.is(res.status, 200, 'testI18n is ok');
  t.is(res.text, 'kone is a framework base on Koa2 for node.js', 'app.title=kone is a framework base on Koa2 for node.js');
});
