import log4js from 'log4js';

log4js.configure({
    appenders: {
        error: {
            type: 'file',
            category: 'error',
            filename: __dirname + '/../logs/error.log/', //日志输出位置，当目录文件或文件夹不存在时自动创建
            maxLogSize: 104800, // 文件最大存储空间
            backups: 100,  //当文件内容超过文件存储空间时，备份文件的数量
        },

        http: {
            type: 'dateFile',
            category: 'http',
            filename: __dirname + '/../logs/http/',
            pattern: 'yyyy-MM-dd.log', //日志输出模式
            alwaysIncludePattern: true,
            maxLogSize: 104800,
            backups: 100,
        },
    },

    categories: {
        error: {
            appenders: ['error'],
            level: 'error',
        },
        http: {
            appenders: ['http'],
            level: 'info',
        },
        default: {
            appenders: ['http'],
            level: 'info',
        },
    },

    replaceConsole: true,
});


let format = {
    error(ctx, err, costTime) {
        let method = ctx.method;
        let url = ctx.url;
        let body = ctx.request.body;
        let userAgent = ctx.header.userAgent;
        return {method, url, body, costTime, err};
    },
    http(ctx, cost) {
        let method = ctx.method;
        let url = ctx.url;
        let body = ctx.request.body;
        let userAgent = ctx.header.userAgent;
        return {method, url, body, cost, userAgent};
    },
}


let log = {};

log.error = (ctx, error, resTime) => {
    if (ctx && error) {
        log4js
            .getLogger('error')
            .error(format.error(ctx, error, resTime));
    }
}


log.http = (ctx, resTime) => {
    if (ctx) {
        log4js
            .getLogger('http')
            .info(format.http(ctx, resTime));
    }
}

export default log;
