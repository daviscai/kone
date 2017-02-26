import Router from 'trek-router';
import Home from '../controllers/home';

let router = new Router();

router.get('/', Home.index);
router.get('/home', Home.index);
router.get('/home/testI18n', Home.testI18n);

module.exports = router;
