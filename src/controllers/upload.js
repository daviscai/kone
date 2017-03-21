'use strict';

const fs = require('mz/fs');
const path = require('path');
const appDir = path.resolve(__dirname, '../../');



class Upload {
  constructor(ctx) {
    this.ctx = ctx;
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

    ctx.body = 'aaaa';
    ctx.status = 200;
  }

  async client(ctx) {
    let csrf = ctx.store.get('csrf');

    await ctx.render('home/upload.tpl', {
      csrf: csrf
    });
  }

}

module.exports = Upload
