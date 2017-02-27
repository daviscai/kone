[![Build Status](https://travis-ci.org/daviscai/kone.svg?branch=master)](https://travis-ci.org/daviscai/kone)
[![codecov](https://codecov.io/gh/daviscai/kone/branch/master/graph/badge.svg)](https://codecov.io/gh/daviscai/kone)

## kone 是什么？
kone (俗称k丸) 是基于[Koa2](http://koajs.com/)和[Trekjs](https://trekjs.com/)搭建的node.js开发框架，以性能优先的原则构建，同时，框架集成常用中间件，以保证中间件能得到及时维护和最好的性能表现，也降低了中间件筛选的成本，开箱即用。



## kone(k丸) 有什么特性？

1. 基于Koa2洋葱模型，性能优先
2. 支持ES6+特性，包括async/await
3. 集成常用中间件，开箱即用
4. 支持ava单元测试
5. 支持代码规范检测
6. 通过rollup打包，更小的文件体积
7. 支持i18n，本地化和国际化语言
8. 通过nodemon监听服务，代码更新自动生效，无需手动重启node服务
9. 通过pm2部署应用


## kone(k丸) 技术栈
1. Koa2
2. rollup, 打包
3. ava，测试
4. nunjucks，模板
5. eslint，编码规范检测
6. nodemon， 代码自动生效
7. pm2， 应用部署
8. antd & react & react-router ， 视图组件
9. ioredis ， redis缓存
10. sequelize orm ，数据库

## 快速开始

node版本支持6+，对系统的GCC版本要求较高，如果需要升级GCC版本，可以参考
[Centos6.5升级glibc过程](https://cnodejs.org/topic/56dc21f1502596633dc2c3dc)  
[CentOS 6.X使用RPM包升级GLIBC](http://blog.ttionya.com/article-1559.html)   
[CentOS 升级 gcc 和 g++ 的方法](http://www.wengweitao.com/centos-sheng-ji-gcc-he-g-de-fang-fa.html)  


安装依赖包：
```
git clone https://github.com/daviscai/kone.git
export NODE_ENV=development
npm install -c  
```

或者用 [Yarn](https://yarnpkg.com/docs/usage/) 代替NPM：
```
npm install -g yarn -c
yarn
```

安装完后，编译运行：
```
npm run compile
npm run test
npm run watch
npm run start-dev

http://127.0.0.1:4000
```


src为源码目录，需要用babel编译后才能运行，编译后的目录为app ，可执行 `npm run watch` 监听src目录下的文件修改自动重新编译到app目录下

执行 `npm run start-dev` 监听 app目录下代码的改动，自动重启node

## Bench

详细看 [benchmarks](https://github.com/daviscai/kone/tree/master/benchmarks)

结论：  
1. 未使用模板渲染下，kone比koa快1.6倍，koa默认没有使用 bluebird，如果使用bluebird代替默认的Promise，性能会提升较多，但kone比koa依然快24%     
2. 使用模板渲染下，kone和koa性能差不多，kone在模板渲染方面还有优化空间  


## License
MIT
