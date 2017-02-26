## Bench

```
cd benchmarks;
npm install -c
npm run bench
npm run bench-mw
```

#### 性能比较 node native, koa, toa, trek, kone  
use bluebird Promise, see [better performance](https://github.com/koajs/koa/pull/751)

```
node version : v6.9.0
"express": "^4.14.1",
"koa": "^2.0.0-alpha.7",
"toa": "^2.5.1",
"trek-engine": "^0.5.3"

电脑配置：
MacBook Air (13-inch, Early 2014)
cpu : 1.4 GHz Intel Core i5
内存： 4 GB 1600 MHz DDR3

$ npm run bench

> banchmarks@1.0.0 bench /Users/caidavis/Documents/git/kone/benchmarks
> make battle


------- node -------
okay
Stat         Avg     Stdev     Max
Latency (ms) 9.36    4.19      78
Req/Sec      10178.4 1149.55   11319
Bytes/Sec    1.5 MB  158.37 kB 1.7 MB

51k requests in 5s, 7.53 MB read

  5 middleware
------- kone -------
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

#### kone vs koa2 with middleware

$ npm run bench-mw


### 未使用模板渲染

全部常用中间件 ：jsonp,router,logger,staticServer,bodyParser,session,i18n,cors,csrf,helmet,favicon,router，template

#### koa未使用 bluebird， kone 使用了 bluebird

QPS(每秒请求数), kone 比 koa 大概多2100次

```
------- kone -------
xxx("aaa");
Stat         Avg     Stdev    Max
Latency (ms) 28.34   9.53     131
Req/Sec      3467    360.68   3763
Bytes/Sec    1.06 MB 115.2 kB 1.18 MB

17k requests in 5s, 5.34 MB read

------- koa -------
;xxx("hello");
Stat         Avg      Stdev   Max
Latency (ms) 75.22    11.25   229
Req/Sec      1313.4   55.11   1372
Bytes/Sec    208.9 kB 8.97 kB 221.18 kB

7k requests in 5s, 1.05 MB read
```

#### koa和kone 均使用了 bluebird

QPS(每秒请求数), kone 比 koa 大概多700次

```
------- kone -------
xxx("aaa");
Stat         Avg       Stdev     Max
Latency (ms) 30.77     10.84     148
Req/Sec      3197.4    469.93    3507
Bytes/Sec    996.15 kB 147.05 kB 1.11 MB

16k requests in 5s, 4.92 MB read

------- koa -------
;xxx("hello");
Stat         Avg       Stdev   Max
Latency (ms) 40.05     17.08   195
Req/Sec      2466.4    448.64  2953
Bytes/Sec    394.85 kB 69.2 kB 475.13 kB

12k requests in 5s, 1.97 MB read

------- kone -------
xxx("aaa");
Stat         Avg     Stdev     Max
Latency (ms) 28.5    9.51      144
Req/Sec      3445.4  402.31    3701
Bytes/Sec    1.05 MB 127.92 kB 1.18 MB

17k requests in 5s, 5.31 MB read

------- koa -------
;xxx("hello");
Stat         Avg       Stdev    Max
Latency (ms) 35.09     14.09    187
Req/Sec      2809      362.69   3111
Bytes/Sec    447.28 kB 58.07 kB 507.9 kB

14k requests in 5s, 2.25 MB read
```



### 使用模板渲染，模板引擎是 nunjucks

全部常用中间件 ：jsonp,router,logger,staticServer,bodyParser,session,i18n,cors,csrf,helmet,favicon,router，template

#### koa未使用 bluebird， kone 使用了 bluebird

QPS(每秒请求数), kone 比 koa 大概多200次

```
------- kone -------
xxx("\n<h2>kone is a framework base on Koa2 for node.js</h2>\n");
Stat         Avg       Stdev    Max
Latency (ms) 64.67     19.95    206
Req/Sec      1526.8    252.85   1800
Bytes/Sec    543.95 kB 86.79 kB 655.36 kB

8k requests in 5s, 2.76 MB read

------- koa -------
;xxx("\n<h2>aaa</h2>\n");
Stat         Avg       Stdev    Max
Latency (ms) 76.94     22.77    256
Req/Sec      1282.6    204.18   1475
Bytes/Sec    220.36 kB 34.99 kB 253.95 kB

6k requests in 5s, 1.1 MB read
```

#### koa和kone 均使用了 bluebird

QPS(每秒请求数), kone 比 koa 大概多100次

```
------- kone -------
xxx("\n<h2>kone is a framework base on Koa2 for node.js</h2>\n");
Stat         Avg       Stdev    Max
Latency (ms) 65.56     21.48    208
Req/Sec      1503      264.29   1717
Bytes/Sec    539.03 kB 88.59 kB 622.59 kB

8k requests in 5s, 2.72 MB read

------- koa -------
;xxx("\n<h2>aaa</h2>\n");
Stat         Avg       Stdev    Max
Latency (ms) 68.73     21.07    214
Req/Sec      1438      180.4    1592
Bytes/Sec    246.58 kB 32.09 kB 278.53 kB

7k requests in 5s, 1.23 MB read

------- kone -------
xxx("\n<h2>kone is a framework base on Koa2 for node.js</h2>\n");
Stat         Avg       Stdev    Max
Latency (ms) 64.57     21.22    221
Req/Sec      1532.6    228.63   1741
Bytes/Sec    558.69 kB 82.31 kB 655.36 kB

8k requests in 5s, 2.77 MB read

------- koa -------
;xxx("\n<h2>aaa</h2>\n");
Stat         Avg       Stdev   Max
Latency (ms) 70.49     23.96   254
Req/Sec      1406      249.92  1686
Bytes/Sec    240.03 kB 41.5 kB 294.91 kB

7k requests in 5s, 1.2 MB read
```

结论：
1. 未使用模板渲染下，kone比koa快1.6倍，koa默认没有使用 bluebird，如果使用bluebird代替默认的Promise，性能会提升较多，但kone比koa依然快24%
2. 使用模板渲染下，kone和koa性能差不多，kone在模板渲染方面还有优化空间


## why 为什么会快这么多
1. 基于 koa2 application.js 核心功能，简化上下文，采用trekjs的request和response，去掉了delegate代理模块
2. 中间件合并处理compose改用迭代器 iterator，不用递归调用的方式
3. Promise采用性能更快的bluebird，性能提升显著
4. 在洋葱模型之外添加一层最后处理中间层，避免部分中间件采用async/await方式处理，async/await对性能有一定影响。


## License
MIT
