'use strict'

const fs = require('mz/fs')
const formidable = require('formidable')

module.exports = uploadFile

function uploadFile(opts) {
  opts = opts || {}

  const form = new formidable.IncomingForm(opts);
  form.uploadDir = opts.uploadDir ||  (os.tmpdir && os.tmpdir()) || os.tmpDir();

  return async (ctx, next)=> {

    if(!ctx.req.get('Content-Type').includes('multipart/form-data')) return next();

    fs.mkdir(form.uploadDir).then(function() {}).catch((err) => {});
    // try {
    //     let stats = await fs.stat(form.uploadDir);
    //     if(!stats.isDirectory()){
    //         await fs.mkdir(form.uploadDir);
    //     }
    // } catch (err) {
    //     if(err.code === 'ENOENT'){
    //         await fs.mkdir(form.uploadDir);
    //     }
    // }

    await form.parse(ctx.req.raw, function(err, fields, files) {
      if (err) throw err
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
      ctx.req.body = fields
      ctx.req.files = filesObj
    })

    return next();
  }
}
