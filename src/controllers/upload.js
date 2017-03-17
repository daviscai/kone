'use strict';

const fs = require('mz/fs');
const path = require('path');
//const imagemin = require('imagemin');
//const imageminPngquant = require('imagemin-pngquant');
//const imageminMozjpeg = require('imagemin-mozjpeg');
const appDir = path.resolve(__dirname, '../../');



class Upload {
  constructor() {
    console.log(this);

  }

  index(ctx) {
    this.test('aaa');
    ctx.body = 'a';
    ctx.status = 200
  }

  test(aa) {
    console.log(aa);
  }

  /**
   * http://localhost:port/upload
   *
   * @type {[type]}
   */
  async upload(ctx) {

    // 取post 数据
    // console.log(ctx.req.body);
    // console.log(ctx.req.files);

    // let uploadDir = path.join(appDir, 'uploads');
    // let buildDir = path.join(appDir, 'uploads/build');
    // try {
    //   await fs.mkdir(buildDir);
    // } catch (err) {}

    // imagemin([uploadDir + '/*.png'], buildDir, {
    //   use: [
    //     imageminPngquant({
    //       quality: 90,
    //       speed: 5 // 1 (brute-force) to 10 (fastest) , Default: 3
    //     })
    //   ]
    // }).then(() => {
    //   //压缩完成，分发到cdn
    //   this.distributeToCDN();
    //   //console.log('png Images optimized');
    // });

    // imagemin([uploadDir + '/*.jpg'], buildDir, {
    //   use: [
    //     imageminMozjpeg({
    //       quality: 80
    //     })
    //   ]
    // }).then(() => {
    //   //压缩完成，分发到cdn
    //   console.log('jpeg mages optimized');
    // });

    ctx.body = 'aaaa';
    ctx.status = 200;
  }

  //分发到cdn
  distributeToCDN() {
    let buildDir = path.join(appDir, 'uploads/build');
    console.log(buildDir);
  }

  async client(ctx) {
    let csrf = ctx.store.get('csrf');

    await ctx.render('home/upload.tpl', {
      csrf: csrf
    });
  }

}

module.exports = Upload
