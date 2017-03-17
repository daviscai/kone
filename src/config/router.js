// import Router from 'trek-router';
// import Home from   '../controllers/home';
// import Upload from '../controllers/upload';
//
// let router = new Router();
//
// router.get('/', Home.index);
// router.get('/home', Home.index);
// router.get('/home/testI18n', Home.testI18n);
// router.get('/home/testRedis', Home.testRedis);
// router.get('/home/testMongo', Home.testMongo);
// router.get('/home/testDB', Home.testDB);
// router.get('/home/testLogger', Home.testLogger);
// router.get('/home/testAll', Home.testAll);
//
//
// router.post('/upload',  Upload.upload);
// router.get('/client', Upload.client);
//
//
// module.exports = router;




let router = [];

router['/upload/index'] = 'upload.index';  // upload.index , admin/upload.index,  module/controller.action.query

//router['/upload/(:num)'] = 'upload.index.id=$1';

//$route['product/(:any)'] = 'def/product/detail/id=$1';
//$route['([a-z]+)/(\w+)'] = 'def/$1/$2';
//$route['(201\d)/([\w\d-_]*)/([\w\d-_]*)'] = 'y_$1/$2/$3';
//$route['login/(.+)'] = 'auth/login/login/$1';


module.exports = router;
