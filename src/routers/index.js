import fs from 'fs';
import path from 'path';
import Router from 'koa-router';
import home from '../controllers/home';

const basename = path.basename(module.filename);
const router = Router();

fs.readdir(__dirname, (err, files)=>{
    if(err){
        return false;
    }
    files.forEach((file)=>{
        if( (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js') ){
            let route = require(path.join(__dirname, file));
            router.use(route.routes(), route.allowedMethods());
        }
    });
});

// default controller.action for http://your-domain/
router.get('/', home.index);

export default router;
