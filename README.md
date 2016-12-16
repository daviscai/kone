https://www.smashingmagazine.com/2016/08/getting-started-koa-2-async-functions/

###  setp 1 : `koa2 + babel` , run simple app for node.js

see package.json :
```js
"dependencies": {
  "babel-polyfill": "^6.20.0",
  "koa": "^2.0.0-alpha.7",
},
"devDependencies": {
  "babel-cli": "^6.18.0",
  "babel-preset-es2015": "^6.18.0",
  "babel-preset-stage-3": "^6.17.0",
  "babel-register": "^6.18.0",
},
"babel": {
  "presets": [
    "es2015",
    "stage-3"
  ]
}
```
so, need to install dependencies:

```
npm install --save \
  # babel-polyfill provides the runtime that async functions need
  babel-polyfill \
  # The Koa framework itself
  koa@next \

npm install --save-dev \
   # Babel CLI to build our app
   babel-cli \
   # A set of Babel plugins to support ES6 features
   babel-preset-es2015 \
   # and to support stage-3 features
   babel-preset-stage-3 \
   # Overrides Node.js's require and compiles modules at runtime
   babel-register \
```

then,  create index.js like this :
```js
//babel-polyfill provides the runtime that async functions need
require('babel-polyfill');

//Overrides Node.js's require and compiles modules at runtime
require('babel-register');

const port = 4000;
const app = require('./app/index').default;
app.listen(port, () => console.log(`Listening on port ${port}.`));
```

we put the app index.js into app folder , make it :

```js
import Koa from 'koa';

// //Create the app from the ES6 class.
const app = new Koa();

app.use(async (ctx, next) => ctx.body = 'Hello World');

export default app;
```

finaly, run by node command :  
`node index`

```js
$ node index
Listening on port 4000.
```

and then , app directory structure looks like this:
```js
kwan/
    |app/
        |index.js
    node_modules
    index.js
    package.json
    README.md
```



### step 2 : `koa2 + babel + eslint + react`, support eslint and react


```
npm install --save \

npm install --save-dev \
   # eslint and use airbnb config , support react
   eslint eslint-config-airbnb eslint-plugin-jsx-a11y@2.2.3 eslint-plugin-import eslint-plugin-react

```

see [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

edit .eslintrc config file :
```
{
    "extends": "airbnb",
    "env": {
        "browser": true,
        "node": true,
        "mocha": true
    },
    "ecmaFeatures": {
        "forOf": true,
        "jsx": true,
        "es6": true
    },
    "rules": {
        "comma-dangle": 0,
        "indent": [2, 2, {"SwitchCase": 1}],
        "react/prop-types": 0
    }
}
```

edit package.json , add script :

```js
"scripts": {
  "start-dev": "./node_modules/.bin/rollup -c config/rollup/dev.js",
  "lint": "eslint . --ext .js",
},
```

then , run script:

`npm run lint`  see the result:

```
$ npm run lint

> kwen@1.0.0 lint D:\work\project\kwen
> eslint . --ext .js

D:\work\project\kwen\app\index.js
  1:23  error  Expected linebreaks to be 'LF' but found 'CRLF'     linebreak-style
  2:1   error  Expected linebreaks to be 'LF' but found 'CRLF'     linebreak-style
  3:40  error  Expected linebreaks to be 'LF' but found 'CRLF'     linebreak-style
  4:23  error  Expected linebreaks to be 'LF' but found 'CRLF'     linebreak-style
  5:1   error  Expected linebreaks to be 'LF' but found 'CRLF'     linebreak-style
  6:9   error  Arrow function should not return assignment         no-return-assign
  6:21  error  'next' is defined but never used                    no-unused-vars
  6:30  error  Assignment to property of function parameter 'ctx'  no-param-reassign
  6:56  error  Expected linebreaks to be 'LF' but found 'CRLF'     linebreak-style
  7:1   error  Expected linebreaks to be 'LF' but found 'CRLF'     linebreak-style
  8:20  error  Expected linebreaks to be 'LF' but found 'CRLF'     linebreak-style

```
























```
npm install --save \
  # babel-polyfill provides the runtime that async functions need
  babel-polyfill \
  # The Koa framework itself
  koa@next \
  # Because Koa is minimalist, we need a parser
  # to parse JSON in the body of requests
  koa-bodyparser@next \
  # and the router
  koa-router@next \
  # The redis module to store the app's data
  redis\
  # The Koa cors module to allow cross-origin requests
  kcors@next


  npm install --save-dev \
   # To write assertions in our tests
   chai \
   # A popular testing framework
   mocha \
   # API-level tests
   supertest \
   # Babel CLI to build our app
   babel-cli \
   # A set of Babel plugins to support ES6 features
   babel-preset-es2015 \
   # and to support stage-3 features
   babel-preset-stage-3 \
   # Overrides Node.js's require and compiles modules at runtime
   babel-register \
   # To watch JavaScript files in development and restart the server
   # if there are changes in the files
   nodemon
```
