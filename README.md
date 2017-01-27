[![Build Status](https://travis-ci.org/daviscai/kwan.svg?branch=master)](https://travis-ci.org/daviscai/kwan)

## kwan 是什么？
kwan (又名k丸) 是基于Koa2搭建的node.js开发框架，Koa2仅提供最基本的核心功能，允许向执行流中插入中间件来实现业务功能，同时，koa官方收集了非常多的中间件，可满足绝大部分业务需求，这也给使用者带来了另一个问题，我该用哪些中间件来满足我的业务？高度的灵活性也意味着每个开发者都需要自行搭建一整套的开发环境，否则难于在实际生产环境和多人协作团队中使用。

`所以，就有了kwan(k丸)，一个尽可能简单的，符合业务和视图分离的，高度可扩展的node.js开发框架。`


## kwan(k丸) 有什么特性？

1. 基于Koa2，可以使用丰富的中间件
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

npm run test
npm run start-dev

http://127.0.0.1:4000/home/testAntd
```

## 代码目录结构
```
kwan\
    |app\
        |config\
                |locales\  //本地化语言文件
                        |en.js
                        |zh-cn.js
                |config.js
                |databases.js
        |controllers\
                |home.js
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

## About Me
80后，8年码农经验，[个人博客](http://wenzzz.com)，现在迅雷负责游戏部门的PHP和前端团队，kwan(k丸)，node开发框架也是在团队技术转型大背景下的产物，希望给团队带来更多好玩的技术。  
kwan(k丸)框架将会被用于多个内部项目，不断完善。



## License
MIT
