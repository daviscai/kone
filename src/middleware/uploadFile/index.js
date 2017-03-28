'use strict'

const fs = require('mz/fs')
const formidable = require('formidable')
const Promise = require('bluebird')

module.exports = uploadFile

function uploadFile(opts) {
  opts = opts || {}

  const form = new formidable.IncomingForm(opts);
  form.uploadDir = opts.uploadDir ||  (os.tmpdir && os.tmpdir()) || os.tmpDir();
  fs.mkdir(form.uploadDir).then(function() {}).catch((err) => {});

  return async (ctx, next)=> {

    if(!ctx.req.get('Content-Type').includes('multipart/form-data')) return next();

    // Setting multiArgs to true means the resulting promise will always fulfill with an array of the callback's success value(s)
    var parse = Promise.promisify(form.parse, {context: form, multiArgs:true});
    //var parse = promisify(form.parse, form);
    try{
        let rs = await parse(ctx.req.raw);

        let files = rs[1] || '';
        let filesObj = {};
        if(files){
            for(let f in files){
                let file = {};
                for(let k in files[f]){
                    if(['domain','size','path','name','type','hash','lastModifiedDate'].includes(k)){
                        file[k] = files[f][k];
                    }
                }
                filesObj[f] = file;
            }
        }

        ctx.req.body = rs[0] || '';
        ctx.req.files = filesObj
    }catch(err){
        //异常情况
    }

    // 回调方式
    // form.parse(ctx.req.raw, function(err, fields, files) {
    //     console.log('2222')
    //   if (err) throw err
    //   let filesObj = {};
    //   if(files){
    //       for(let f in files){
    //           let file = {};
    //           for(let k in files[f]){
    //               if(['domain','size','path','name','type','hash','lastModifiedDate'].includes(k)){
    //                   file[k] = files[f][k];
    //               }
    //           }
    //           filesObj[f] = file;
    //       }
    //   }
    //   ctx.req.body = fields
    //   ctx.req.files = filesObj
    // })

    return next();
  }
}

// 不支持callback回传多个参数，改用 bluebird.promisify
// function promisify(fn, receiver){
//   return (...args) => {
//     return new Promise((resolve, reject) => {
//       fn.apply(receiver, [...args, (err, res) => {
//         return err ? reject(err) : resolve(res);
//       }]);
//     });
//   };
// };
