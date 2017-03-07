/**
 *
 * module.exports = {
 *      "redis": [  // 数组形式，如果只有一条配置，表示单机
 *         {"port": 6379, "host": "127.0.0.1", "family": 4, "db": 1},
 *         //"redis://:authpassword@127.0.0.1:6380/4"
 *     ]
 * }
 *
 * module.exports = {
 *      "redis": [  // 数组形式，如果有多条配置，表示集群
 *         {"port": 7000, "host": "127.0.0.1", "family": 4, "db": 1},
 *         {"port": 7001, "host": "127.0.0.1", "family": 4, "db": 1},
 *         {"port": 7002, "host": "127.0.0.1", "family": 4, "db": 1},
 *         {"port": 7003, "host": "127.0.0.1", "family": 4, "db": 1},
 *         {"port": 7004, "host": "127.0.0.1", "family": 4, "db": 1},
 *         {"port": 7005, "host": "127.0.0.1", "family": 4, "db": 1}
 *     ]
 * }
 */

module.exports = {
    "redis": [
        //{"port": 6379, "host": "127.0.0.1", "family": 4, "db": 1, "connectTimeout": 10000}
        {"port": 7000, "host": "127.0.0.1", "family": 4, "db": 1, "connectTimeout": 10000},
        {"port": 7001, "host": "127.0.0.1", "family": 4, "db": 1, "connectTimeout": 10000},
        {"port": 7002, "host": "127.0.0.1", "family": 4, "db": 1, "connectTimeout": 10000},
        {"port": 7003, "host": "127.0.0.1", "family": 4, "db": 1, "connectTimeout": 10000},
        {"port": 7004, "host": "127.0.0.1", "family": 4, "db": 1, "connectTimeout": 10000},
        {"port": 7005, "host": "127.0.0.1", "family": 4, "db": 1, "connectTimeout": 10000}
    ]
}
