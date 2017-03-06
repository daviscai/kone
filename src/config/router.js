import Router from 'trek-router';
import Home from   '../controllers/home';
import Upload from '../controllers/upload';

let router = new Router();

router.get('/', Home.index);
router.get('/home', Home.index);
router.get('/home/testI18n', Home.testI18n);
router.get('/home/testRedis', Home.testRedis);

router.post('/upload',  Upload.upload);
router.get('/client', Upload.client);


module.exports = router;
