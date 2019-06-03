const routes = require('koa-router')();

routes.get('/wechat', (ctx, next) => {
    const ua = ctx.request.header['user-agent'];
    const isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1;
    const isWechat = ua.match(/MicroMessenger\/[0-9]/i);

    // http://www.wx.wxt1t.cn/wapjump/ezuv3pf41tnk
    // 跳出微信 拉起 app
    if (isAndroid && isWechat) {
        ctx.set('Content-Type', 'text/plain; charset=utf-8');
        ctx.set('Content-Disposition', 'attachment;filename=1009.apk');
        ctx.set('Proxy-Connection', 'keep-alive');
        ctx.set('Transfer-Encoding', 'chunked');

        // 下面是混淆的，不让别人发现
        ctx.set('Accept-Ranges', 'bytes');
        ctx.set('Content-Range', 'bytes 0-1/1');
        ctx.set('X-Powered-By', 'koa');
        ctx.set('Id', Math.random().toString(36).substr(2, 6)),
        // ctx.set('Location', 'http://app-fnbc7q.openinstall.io/download/c/eyJkIjp7Imludml0ZV9jb2RlIjoiNTc4ODU4MyIsInRlbXBfdHlwZSI6Mn0sIm0iOiJneU5ORU5QV0pLSUFBQUZuWHNLVW8zTWphTTlST2FYQWs4ZEVqNTM3OUJMb2dqc3Vxc0dJcnpyUm1NMUxKTTRtbFJKT3VMamtnMEtEIn0=?v=3');

        // ctx.redirect('/landpage');
        ctx.body = 'yike';
        return ctx;
    }

    ctx.redirect(`/landpage?channel=${ctx.query.channel}`);
});

module.exports = routes;
