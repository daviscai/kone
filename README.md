[![Build Status](https://travis-ci.org/daviscai/kwan.svg?branch=master)](https://travis-ci.org/daviscai/kwan)
[![codecov](https://codecov.io/gh/daviscai/kwan/branch/master/graph/badge.svg)](https://codecov.io/gh/daviscai/kwan)

## kwan 是什么？
kwan (又名k丸) 是基于Koa2搭建的node.js开发框架，Koa2仅提供最基本的核心功能，允许向执行流中插入中间件来实现业务功能，同时，koa官方收集了非常多的中间件，可满足绝大部分业务需求，这也给使用者带来了另一个问题，我该用哪些中间件来满足我的业务？高度的灵活性也意味着每个开发者都需要自行搭建一整套的开发环境，否则难于在实际生产环境和多人协作团队中使用。

`所以，就有了kwan(k丸)，一个尽可能简单的，符合业务和视图分离的，高度可扩展的node.js开发框架。`


## kwan(k丸) 有什么特性？

1. 基于Koa2，优化内核，拥有接近node原生应用的性能，性能优先
2. 可以使用ES6+特性，包括async/await
3. mvc模式，路由，日志，模板，控制器等基础功能开箱即用
4. 支持redis分布式缓存，数据库集群读写分离等高性能，高可用的基础架构
5. 支持antd
6. 支持ava单元测试
7. 支持代码规范检测
8. 通过rollup打包，更小的文件体积
9. 支持i18n，本地化和国际化语言
10. 通过nodemon监听服务，代码更新自动生效，无需手动重启node服务
11. 通过pm2部署应用


## kwan(k丸) 技术栈
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
```
git clone https://github.com/daviscai/kwan.git
export NODE_ENV=development
npm install -c

npm run compile
npm run test
npm run start-dev

http://127.0.0.1:4000/home/testAntd
```

## 代码目录结构
```
kwan\
    |benchmarks //性能压力测试
    |src\
        |config\
                |locales\  //本地化语言文件
                        |en.js
                        |zh-cn.js
                |config.js
                |databases.js
        |controllers\
                    |home.js
        |core\
             |compose.js //核心，处理中间件
             |index.js   //核心，修改自koa2 application.js
        |middleware\     //中间件
                   |kwan-jsonp  
        |models\
                |index.js
                |user.js
        |routers\
                |index.js
                |home.js
        |views\
                |layout\
                        |layout.tpl
                        |footer.tpl
                        |header.tpl
                |home\
                    |index.tpl
                    |list.tpl
                    |reg.tpl
        |index.js  // 应用入口文件
    |assets\
        |css\
        |js\
        |upload\
    |test\
        |controllers\

    |index.js
    |package.json
    |rollup.config.js
    |log4js.json   //日志配置文件
    |.eslintrc     //eslint 代码规范检测配置文件
```

src为源码目录，需要用babel编译后才能运行，编译后的目录为app ，可执行 `npm run watch` 监听src目录下的文件修改自动重新编译到app目录下

执行 `npm run start-dev` 监听 app目录下代码的改动，自动重启node


## Bench

```
cd benchmarks;
npm install -c
npm run bench
```

#### 性能比较 node native, koa, toa, trek, kwan  
use bluebird Promise, see [better performance](https://github.com/koajs/koa/pull/751)

```
node version : v6.9.0
"express": "^4.14.1",
"koa": "^2.0.0-alpha.7",
"toa": "^2.5.1",
"trek-engine": "^0.5.3"

$ npm run bench

> banchmarks@1.0.0 bench /Users/caidavis/Documents/git/kwan/benchmarks
> make battle


------- node -------
okay
Stat         Avg     Stdev     Max
Latency (ms) 9.36    4.19      78
Req/Sec      10178.4 1149.55   11319
Bytes/Sec    1.5 MB  158.37 kB 1.7 MB

51k requests in 5s, 7.53 MB read

  5 middleware
------- kwan -------
Hello World
Stat         Avg     Stdev     Max
Latency (ms) 7.74    4.25      72
Req/Sec      12175.2 1112.86   12975
Bytes/Sec    1.33 MB 127.08 kB 1.44 MB

61k requests in 5s, 6.76 MB read

  5 middleware
------- toa -------
Hello World
Stat         Avg       Stdev    Max
Latency (ms) 17.31     8.25     74
Req/Sec      5625.2    522.26   6191
Bytes/Sec    969.93 kB 91.75 kB 1.11 MB

28k requests in 5s, 4.81 MB read

  5 middleware
------- trek -------
Hello World
Stat         Avg     Stdev     Max
Latency (ms) 8.64    4.47      79
Req/Sec      10990.8 1471.03   11887
Bytes/Sec    1.66 MB 224.74 kB 1.84 MB

55k requests in 5s, 8.3 MB read

  5 middleware
------- koa -------
Hello World
Stat         Avg     Stdev     Max
Latency (ms) 10.62   5.8       85
Req/Sec      9002    1273.81   10367
Bytes/Sec    1.35 MB 184.09 kB 1.57 MB

45k requests in 5s, 6.8 MB read

  5 middleware
------- express -------
Hello World
Stat         Avg       Stdev    Max
Latency (ms) 24.64     4.45     129
Req/Sec      3987      199.14   4135
Bytes/Sec    842.14 kB 38.21 kB 884.74 kB

20k requests in 5s, 4.19 MB read
```

#### 业务逻辑下比较koa2和kwan
```
$ ./node_modules/.bin/autocannon -c 100 -d 5  http://localhost:4000
优化前，基于koa2
Running 5s test @ http://127.0.0.1:4000
100 connections

Stat         Avg       Stdev    Max
Latency (ms) 21.59     3.54     62
Req/Sec      4522.8    47.02    4579
Bytes/Sec    658.64 kB 16.05 kB 688.13 kB

23k requests in 5s, 3.28 MB read


优化后，重写内核
Running 5s test @ http://localhost:4000
100 connections

Stat         Avg     Stdev     Max
Latency (ms) 9.15    5.7       129
Req/Sec      10407.6 1370.53   11319
Bytes/Sec    1.08 MB 137.63 kB 1.18 MB

52k requests in 5s, 5.41 MB read


使用了jsonp中间件：

$ ./node_modules/.bin/autocannon -c 100 -d 5  http://127.0.0.1:4000\?callback\=aaa\&a\=22
优化前，基于koa2 和 koa-jsonp中间件
Running 5s test @ http://127.0.0.1:4000?callback=aaa&a=22
100 connections

Stat         Avg      Stdev    Max
Latency (ms) 25.79    6.06     143
Req/Sec      3809     291.35   3995
Bytes/Sec    614.4 kB 49.15 kB 655.36 kB

19k requests in 5s, 3.05 MB read

优化后，重写内核和jsonp中间件
Running 5s test @ http://127.0.0.1:4000?callback=aaa&a=22
100 connections

Stat         Avg     Stdev     Max
Latency (ms) 9.94    3.58      81
Req/Sec      9604.4  768.89    10263
Bytes/Sec    1.68 MB 145.96 kB 1.84 MB

48k requests in 5s, 8.5 MB read
```

## 性能优化点
1. 只保留koa2 application.js 核心功能，简化上下文，去掉了delegate代理模块
2. 中间件的处理改用迭代器 iterator，不用递归调用
3. Promise采用性能更快的bluebird，性能提升显著

## Roadmap
### release 1.0

2017.2.12 完成常用中间件的集成，同时提供多个方案的性能对比  
2017.2.18 完成内核和中间件的单元测试  
2017.2.22 支持restful api, 并提供示例和单元测试  
2017.2.25 发布第一个release版本  



## License
MIT
