import Router from 'koa-router';
import home from '../controllers/home';

const router = Router({
  prefix: '/home'
});

router.get('/', home.index);
router.get('/getList', home.getList);
router.get('/reg', home.reg);
router.post('/reg', home.reg);
router.get('/about', home.about);

// for require auto in index.js
module.exports = router;
