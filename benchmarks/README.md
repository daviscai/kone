## Bench

```
cd benchmarks;
npm install -c
npm run bench
npm run bench-mw
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

#### kwan vs koa2 with middleware

$ npm run bench-mw

3个常用中间件
```
 kwan vs koa , use jsonp , logger, router middleware
 ./node_modules/.bin/autocannon -c 100 -d 5
------- kwan -------
xxx("hello index");
Stat         Avg     Stdev     Max
Latency (ms) 15.59   5.44      98
Req/Sec      6214    653.4     6727
Bytes/Sec    1.14 MB 120.66 kB 1.25 MB

31k requests in 5s, 5.69 MB read

------- koa -------
;xxx("hello koa");
Stat         Avg      Stdev    Max
Latency (ms) 34.04    8.11     139
Req/Sec      2887.8   281.44   3131
Bytes/Sec    473.5 kB 45.88 kB 524.29 kB

14k requests in 5s, 2.37 MB read
```

8个常用中间件，QPS(每秒请求数), kwan 比 koa 多一倍
```
kwan vs koa , use jsonp , logger, static, bodyparse, session, i18n, csrf, template middleware
 ./node_modules/.bin/autocannon -c 100 -d 5
------- kwan -------
xxx("kwan is a framework base on Koa2 for node.js");
Stat         Avg       Stdev     Max
Latency (ms) 42.13     14.19     163
Req/Sec      2341.2    331.03    2601
Bytes/Sec    989.59 kB 146.03 kB 1.11 MB

12k requests in 5s, 4.95 MB read

koa deprecated Support for generators will been removed in v3. See the documentation for examples of how to convert old middleware https://github.com/koajs/koa/tree/v2.x#old-signature-middleware-v1x---deprecated dist/bench_middleware/koa.js:73:5
------- koa -------
;xxx("hello");
Stat         Avg       Stdev   Max
Latency (ms) 78.22     15.16   266
Req/Sec      1263.41   68.79   1329
Bytes/Sec    202.34 kB 9.55 kB 212.99 kB

6k requests in 5s, 1.01 MB read
```


## why 为什么会快这么多
1. 基于 koa2 application.js 核心功能，简化上下文，采用trekjs的request和response，去掉了delegate代理模块
2. 中间件的处理改用迭代器 iterator，不用递归调用的方式
3. Promise采用性能更快的bluebird，性能提升显著
4. 所有中间件都采用async/await方式，对比多种实现方案后选择最优的一种
5. 通过 node prof 分析瓶颈和优化


$ ./node_modules/.bin/autocannon -c 100 -d 5 http://127.0.0.1:4000
Running 5s test @ http://127.0.0.1:4000
100 connections

Stat         Avg       Stdev    Max
Latency (ms) 35.66     6.7      91
Req/Sec      2750.2    171.96   2995
Bytes/Sec    940.44 kB 56.38 kB 1.05 MB

14k requests in 5s, 4.7 MB read
--------------------------------------

$ ./node_modules/.bin/autocannon -c 100 -d 5 http://127.0.0.1:4000
Running 5s test @ http://127.0.0.1:4000
100 connections

Stat         Avg     Stdev     Max
Latency (ms) 7.79    4.87      111
Req/Sec      12082.4 1623.14   13183
Bytes/Sec    1.24 MB 172.27 kB 1.38 MB

60k requests in 5s, 6.16 MB read
--------------------------------------

$ ./node_modules/.bin/autocannon -c 100 -d 5 http://127.0.0.1:4000
Running 5s test @ http://127.0.0.1:4000
100 connections

Stat         Avg       Stdev    Max
Latency (ms) 28.63     6.18     87
Req/Sec      3437.4    332.93   3641
Bytes/Sec    914.23 kB 89.38 kB 983.04 kB

17k requests in 5s, 4.61 MB read


with template middleware:
$ ./node_modules/.bin/autocannon -c 100 -d 5 http://127.0.0.1:4000
Running 5s test @ http://127.0.0.1:4000
100 connections

Stat         Avg       Stdev    Max
Latency (ms) 98.13     14.78    177
Req/Sec      1006.4    72.58    1113
Bytes/Sec    730.73 kB 52.43 kB 819.2 kB

5k requests in 5s, 3.69 MB read


## License
MIT
