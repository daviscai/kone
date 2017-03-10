module.exports =  {
    appenders: [
    //   {
    //       type: "console"
    //   },
      {
          category: 'app',
          type: "dateFile",
          filename: "logs/app.log",
          backups: 7, // keep 7 backup files
          maxLogSize: 10*1024*1024, // = 10Mb
          pattern: "yyyy-MM-dd",
          encoding: 'utf-8',
          compress: true,
          layout: {
            type    : "pattern",
            pattern : '{"datetime":"%d","level":"%p","tag":"%c","hostname":"%h","pid":"%z","msg":"%m"}'
          }
      },
      {
          category: 'api',
          type: "dateFile",
          filename: "logs/api.log",
          backups: 7, // keep 7 backup files
          maxLogSize: 10*1024*1024, // = 10Mb
          pattern: "-yyyy-MM-dd",
          encoding: 'utf-8',
          compress: true,
          layout: {
            type    : "pattern",
            pattern : '{"datetime":"%d","level":"%p","tag":"%c","hostname":"%h","pid":"%z","msg":"%m"}'
          }
      }
    ]
    // levels: {
    //     app:  "DEBUG",
    //     api:  "DEBUG",
    // }
    //replaceConsole: true
  }
