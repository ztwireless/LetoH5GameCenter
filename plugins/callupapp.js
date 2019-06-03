// http://a.app.qq.com/o/simple.jsp?pkgname=com.antourong.itouzi
// callUpNative.js
// ================================
import uaParse from './ua-parse';

// 默认配置
const DEFAULT = {
    // 默认为首页
    protocol: 'home?channelid=1',
    loadWaiting: 700, // 唤起超时时间
    failUrl: '//m.pezy.cn', // 唤起失败的链接
    startfrom: 'h5',
    callback: function () {}, // 唤起时 回调函数

    // 协议头
    // androidSchema: 'yike://', //android协议头
    // IosSchema: 'yike://', //ios协议头
    schema: 'yike://',
    channel: 1009,

    // browser: '/wechat'
    // appLinkSchema: '//applink.k.sohu.com?url=', //ios9.3以上universalLink
};


let callUpApp = {
    /**
     * 根据 UA 生成不同的 SCHEMA
     * @param protocol
     * 安卓的二代协议需要编码后再使用，ios的二代协议则不需要编码就可以使用，
     * 如果使用universalLink调起客户端，则二代协议也需要编码
     */
    generateSchema: function () {
        // let encodeProtocol = encodeURIComponent(protocol);
        // let schemaString = encodeProtocol;

        // // 安卓
        // if (this.browser.isAndroid()) {
        //     schemaString = DEFAULT.androidSchema + encodeProtocol;
        // }

        // // ios
        // if (this.browser.isIOS()) {
        //     schemaString = DEFAULT.IosSchema + protocol;
        // }

        // // ios app link
        // if (this.browser.isSupportAPPLink() && DEFAULT.useAppLink && !DEFAULT.autoTrigger) {
        //     schemaString = DEFAULT.appLinkSchema + encodeProtocol;
        // }

        // if (this.browser.isAndroid() && this.browser.isChrome()) {
        //     /**
        //      * protocol: 二代链接(前面需要加pr/)
        //      * package: 客户端包名
        //      * scheme: native 协议头(sohunews)
        //      * S.browser_fallback_url: 调起失败  跳转链接
        //      */
        //     schemaString = 'intent://pr/' + protocol + '/#Intent;' +
        //         'package=' + 'com.sohu.newsclient' + ';' +
        //         'scheme=' + 'sohunews' + ';' +
        //         'S.browser_fallback_url=' + encodeURIComponent(window.location.protocol + DEFAULT.failUrl) + ';' +
        //         'end';
        //     if (DEFAULT.autoTrigger) {
        //         schemaString = 'intent://pr/' + protocol + '/#Intent;' +
        //             'package=' + 'com.sohu.newsclient' + ';' +
        //             'scheme=' + 'sohunews' + ';' +
        //             'end';
        //     }
        // }

        return this.config.schema + this.config.protocol;
    },

    failCallUp: function () {
        let loadTimer = null;
        // 如果 loadWaiting 时间后,还是无法唤醒 app，则直接打开下载页
        // opera 无效
        let start = Date.now();
        let that = this;

        loadTimer = setTimeout(()=> {
            if (document.hidden || document.webkitHidden) {
                return;
            }

            // 如果app启动，浏览器最小化进入后台，则计时器存在推迟或者变慢的问题
            // 那么代码执行到此处时，时间间隔必然大于设置的定时时间
            let time = Date.now() - start;
            if (time > this.config.loadWaiting + 200) {
                // come back from app
                window.location.href = `${this.config.failUrl}?fail=1&channel=${this.config.channel}`;
            } else {
                // 如果浏览器未因为app启动进入后台，则定时器会准时执行，故应该跳转到下载页
                // if (this.browser.isAndroid()) {
                //     window.location.href = this.config.failUrl;
                // } else {

                // }
                window.location.href = `${this.config.failUrl}?fail=2&channel=${this.config.channel}`;
            }
        }, this.config.loadWaiting);

        // 当本地app被唤起，则页面会隐藏掉，就会触发 pagehide 与 visibilitychange 事件
        // 在部分浏览器中可行，网上提供方案，作hack处理
        let visibilitychange = function () {
            var tag = document.hidden || document.webkitHidden;
            tag && clearTimeout(loadTimer);
        };

        document.addEventListener('visibilitychange', visibilitychange, false);
        document.addEventListener('webkitvisibilitychange', visibilitychange, false);

        // pagehide 必须绑定到window
        window.addEventListener('pagehide', function () {
            clearTimeout(loadTimer);
        }, false);
    },

    call: function (schemaUrl) {
        let iframe = document.createElement('iframe');
        let aLink = document.createElement('a');
        let body = document.body;
        let loadTimer = null;
        const device = uaParse(navigator.userAgent);

        // 隐藏 iframe 及 a
        aLink.style.cssText = iframe.style.cssText = 'display:none;width:0px;height:0px;';

        if (device.platform == 'pc') {
            location.href = '//www.pezy.cn/download';
            return;
        }

        const appName = device.app.name;
        if (device.app.isApp) {

            // 微信，拉不起的 场景
            if (appName == 'micromessenger') {
                if (device.os.name == 'ios') {
                    location.href = 'https://itunes.apple.com/cn/app/%E4%BA%BF%E5%88%BB/id1027325728?mt=8';
                    return;
                }

                if (device.os.name == 'android' && this.config.browser) {
                    location.href = `/wechat?channel=${this.config.channel}`;
                    return;
                }

                if (device.os.name == 'android' && this.config.yyb) {
                    location.href = this.config.yyb;
                    return;
                }

                location.href = `${location.origin}/download?channel=${this.config.channel}&deeplink=${encodeURIComponent(this.config.protocol)}`;

            } else if (appName == 'weibo') {
                location.href = `${location.origin}/download?channel=${this.config.channel}&deeplink=${encodeURIComponent(this.config.protocol)}`;

            } else if (appName == 'ucbrowser') {
                // UC 拉不起，直接下载
                window.location.href = '//www.pezy.cn/jump';

            } else if (device.os.name == 'android') {
                iframeCall();

            } else if (device.os.name == 'ios') {
                iframeCall();

            } else {
                iframeCall();
            }

        } else {
            iframeCall();
        }

        // 默认拉起
        function iframeCall () {
            // 其他浏览器
            // 适用：UC,irefox,mobileQQ
            DEFAULT.callback();
            body.appendChild(iframe);
            iframe.src = schemaUrl;
        }

        function linkCall() {
            // 不支持 iframe 的方式跳转
            // ios 8 以上 safari
            // chrome, leibao, mibrowser, opera, 360
            DEFAULT.callback();
            aLink.href = schemaUrl;
            body.appendChild(aLink);
            aLink.click();
        }

        // 超时
        this.failCallUp();
    },


    /**
     * 加载协议,唤起 app
     * @param config
     */
    load: function (options) {
        this.config = Object.assign(DEFAULT, options);

        let schemaUrl = this.generateSchema();
        this.call(schemaUrl);
    },
};

export default callUpApp;
