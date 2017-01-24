import path from 'path';
import test from 'ava';
import supertest from 'supertest-as-promised';

const appDir = path.resolve(__dirname, '../../');

const app = require( appDir + '/app/index').default;

const request = supertest(app.listen());

test('home index', async () => {
    await request.get('/home').expect(200);
});
