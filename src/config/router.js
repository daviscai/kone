let router = [];

// module/controller.action.query

router['/'] = 'home.index';
router['/home/?'] = 'home.index';
router['/home/testI18n'] = 'home.testI18n';
router['/home/testRedis'] = 'home.testRedis';
router['/home/testMongo'] = 'home.testMongo';
router['/home/testDB'] = 'home.testDB';
router['/home/testLogger'] = 'home.testLogger';
router['/home/testAll'] = 'home.testAll';


router['/upload/index'] = 'upload.index';  // upload.index , admin/upload.index,  module/controller.action.query
router['/upload/client'] = 'upload.client';
router['/upload/upload'] = 'upload.upload';
router['/upload/(:num)'] = 'upload.index.id=$1';

//$route['product/(:any)'] = 'def/product/detail/id=$1';
//$route['([a-z]+)/(\w+)'] = 'def/$1/$2';
//$route['(201\d)/([\w\d-_]*)/([\w\d-_]*)'] = 'y_$1/$2/$3';
//$route['login/(.+)'] = 'auth/login/login/$1';


module.exports = router;
