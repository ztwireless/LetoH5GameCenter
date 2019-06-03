const native = {
    handler() {
        let hand = {
            execute: function() {},
            ami: 'h5',
        };

        if (window.nativeHandler) {
            hand = window.nativeHandler;
            hand.ami = 'native';
        }

        return hand;
    },

    getAppInfo() {
        return window.mgc.getAppInfoSync()
    },

    getSystemInfo() {
        return window.mgc.getSystemInfoSync()
    },

    // 关闭当前
    closeWebview() {
        window.mgc.closeH5GameCenter()
    },

    newWebview(options) {
    },

    // 当前个人信息
    getUserInfo() {
        // getAv
        // getAvatarUrl
        // getCoin
        // getDeviceId
        // getGuid
        // getNickName
        // getToken
        // getWeixinOpenid

        const DEFALUT = {
            getGuid() {

            },
            getAv() {

            },
            getAvatarUrl() {

            },
            getNickName() {

            },
            getToken() {

            },
            getWeixinOpenid() {
            },
        }
        console.log('getUserInfo');
        return this.handler().execute('getUserInfo', 'request', '') || DEFALUT;
    },

    // 当前设备信息
    getDeviceInfo() {
        // getDeviceId
        // getVersion app 版本
        // getPublishid 渠道号
        // getScreen 频幕尺寸 'width x height' => '375x750'
        // getOs 系统
        // getBrand 获取手机品牌
        // getRom 获取手机rom version vivo
        // ios idfa 独有
        // 网络情况 ? 下个版本加吧
        // getImei
        // wifiName
        // wifiMac
        // netModel

        console.log('getDeviceInfo');
        const DEFALUT = {
            getDeviceId() {

            },
            getVersion() {

            },
            getPublishid() {

            },
            getScreen() {

            },
            getOs() {

            },
            getBrand() {

            },
            getImei() {

            },

            getNetModel() {

            },
        }

        try {
            return this.handler().execute('getDeviceInfo', 'request', '') || DEFALUT;

        } catch(error) {


        }
    },

    // 登录
    doLogin() {
    },

    // 登录状态监听
    listenSignStatus(callback) {
    },

    wxshare(options) {
        // type: 0 分享到微信好友
        // type: 1 分享到微信朋友圈
        // type: 2 分享到微信朋友圈，不带链接，文字 + 图片
        // type: 3 分享到朋友圈 : thumbUrl: '图片地址'

        // type: 6 微信小程序分享

        options = Object.assign({
            url: '',
            title: '',
            desc: '',
            thumbUrl: '',
            type: 0,
            // miniId: '', // gh_c942f500eee9  原始id
            // miniPath: '', //pages/article/main  分享文章路径
            // miniType: 0, //小程序开发类型，0:release，1:test，2:preview

        }, options);
    },

    nativeShare(options) {
    },

    // 加密
    getSecParams(options) {
    },

    // 检测 重新获取 同盾数盟id
    getSecParamsWithNewIds(options) {
    },

    clipbord(text) {
    },

    // 跳转
    jump(options) {
        // key: type、id、url

        // type:detail
        // id:文章id
        // url:文章 url

        // type:tab
        // id:tab的id

        // type:web
        // url:网页地址

        // type: adweb,
        // id: '',
        // url: ''

        // type: page,
        // id:”upgrade”,
        // url:”activity”

        // “type”:”page”,
        // “id”:”upgrade”,
        // “url”:”dialog”

        // 摇一摇
        // type: shaketoshake

        // type": "feedsAd",
        // "title", "广告任务"

        //游戏tab
        //ios
        //type: "tab"
        //id: '8'
        //android
        //type: 'main'
        //id: '5'
    },

    // 短信
    sms(options) {
        // js调用客户端接口发送短信
        // execute(“shortmessage”,”{}”,””)
        // 动作名称（jump），json对象字符串，回调函数（传空字符串）
        // 第2个参数
        // {
        // “phone”:”13381498902”,
        // “text”:”发送短信的内容”
        // }
    },

    // 判断是否打开push
    judgePush() {
    },
    // 引导打开push
    openPush() {
    },

    reload(url) {
    },

    // h5 检测锁屏打开状态
    checkLockScreen() {
    },

    //h5 检测常驻push打开状态
    checkLongPush() {
    },

    // 获取 手机品牌 大写 （oppo,vivo）
    getBrand() {
    },

    // 获取地理位置
    getLocation() {
        console.log('getLocation');
        try {
            // const location = this.handler().execute('getLocation', '', '');
            // return location;
            // return `${location.getLatitudeString()}x${location.getLongitudeString()}`

            // getLatitudeString() 纬度
            // getLongitudeString() 经度
            //
            // getAddress: function()
            // getArea: function()
            // getCity: function()
            // getCountry: function()
            // getLatitude: function()
            // getLatitudeString: function()
            // getLongitude: function()
            // getLongitudeString: function()
            // getProvince: function()
            // getStreet: function()
            const DEFALUT = {
                getLatitudeString() {

                },
                getLongitudeString() {

                },
            }
            return this.handler().execute('getLocation', '', '') || DEFALUT;
        } catch (error) {
            console.log(error);
        }
    },

    // 查看地理位置权限
    hasLocationPermission() {
    },

    // 微信支付
    payWithWeixin(options, callback) {
    },

    // 绑定微信
    bindWechat(callback) {
    },

    openSetting() {
    },

    // 游客绑定手机号
    bindGuestPhone(options) {
    },

    // 开始小游戏
    startGame(id) {
        window.mgc.navigateToMiniProgram({ appId: id.toString() })
    },

    getLocalGameCenterData() {
        let j = window.mgc.getLocalGameCenterData()
        console.log(`j is ${JSON.stringify(j)}`)
        if(j.gameCenterData && j.gameCenterData.length > 0) {
            return j
        } else {
            return {}
        }
    },

    saveGameCenterDataToLocal(data) {
        window.mgc.saveGameCenterDataToLocal(data)
    },

    // 获取小游戏收藏列表接口
    getFavoriteGameList() {
        let j = window.mgc.getFavoriteGameList()
        if(j.gameList && j.gameList.length > 0) {
            return j
        } else {
            return {}
        }
    },

    // 3、获取最近玩的小游戏接口
    getRecentGameList() {
        let j = window.mgc.getRecentGameList()
        if(j.gameList && j.gameList.length > 0) {
            return j
        } else {
            return {}
        }
    },

    onResume(cb) {
        window.mgc.onShow(cb)
    },

    // 是否拦截客户端 滚动  177 开始支持
    interceptTouchEvent(options) {
    },

    // 清除 页面loading
    hideLoading() {
    },

    //清除激励视频
    clearRewardVideo() {
    },

    // 读取播放激励视频
    loadRewardVideoAndPlay(id, token, requestId, callback) {
    },

    // 激励视频是否播放完成
    isRewardVideoComplete() {
    }
}

export default native;
