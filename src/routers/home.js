import Router from 'koa-router';
import home from '../controllers/home';

const router = Router({
    prefix: '/home'
});

router.get('/', home.index);
router.get('/testI18n', home.testI18n);
router.get('/testCsrf', home.testCsrf);
router.get('/testLogger', home.testLogger);
router.get('/testRedis', home.testRedis);
router.get('/testDB', home.testDB);
router.post('/testJson', home.testJson);
router.get('/testTemplate', home.testTemplate);
router.get('/testAntd', home.testAntd);
router.get('/reg', home.reg);

// for require auto in index.js
module.exports = router;
