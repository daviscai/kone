//import Redis from 'ioredis';
//import models from '../models/index';

const index = async (ctx) => {
    ctx.session.user = "tom3";
    ctx.body = 'aaa';
    ctx.status = 200;
};


/**
 * http://localhost:port/upload
 *
 * @type {[type]}
 */
const upload = async (ctx) => {

    // 取post 数据
    //console.log(ctx.req.body);
    //console.log(ctx.req.files);

    ctx.body = 'aaaa';
    ctx.status = 200;

};


const client = async (ctx) => {
    let csrf = ctx.store.get('csrf');
    await ctx.render('home/upload.tpl',{csrf:csrf});
}

export default {
    index,
    client,
    upload
};
