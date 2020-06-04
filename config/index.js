var version = '100';

module.exports = {
    // 发布版本
    version: version,

    localUrl: 'http://m.pezy.cn',
    shareUrl: 'http://m.meigegou.com.cn',

    qrUrl: 'http://meigegou.com.cn',

    // 梦工厂url
    mgcTestUrl: 'http://h5api_dev.mgc-games.com',
    mgcProdUrl: 'http://h5api.mgc-games.com',
    mgcProdOverseaUrl: 'http://miniapi.zeninto.com',
    mgcApiPathPrefix: '/api/v7/',
    mgcApiGetGameCenterData: 'charge/groups',
    mgcApiGetGameCenterMoreData: 'charge/more',
    mgcMemCoin: 'wx/memcoin',
    mgcPoints: 'wx/points',
    mgcWithDrawInfo: 'withdraw/checkinfo',
    mgcAliInfo: 'wx/getaliinfo',
    mgcSetAliInfo: 'wx/setaliinfo',
    mgcPreapply: 'wx/preapply',
    mgcApplyLog: 'wx/applylog',
    mgcBankInfo: 'wx/membank',
    mgcSetBankInfo: 'wx/setmembank',


    // 前缀URL
    apiBaseUrl: 'http://api.pezy.cn/bc-activity-service',
    // apiBaseUrl: 'http://172.16.81.127:6680/bc-activity-service',
    // apiBaseUrl: 'http://172.16.75.58:6680/bc-activity-service',
    // apiBaseUrl: 'http://172.16.73.142:6680/bc-activity-service',

    gameBaseUrl: 'http://172.16.75.58:6681/bc-activity-game-service',

    userInfoUrl: 'http://172.16.75.58:8080',

    //五一活动接口地址
    labordayUrl: 'http://game.qknode.cn',

    pdUrl: 'http://api.pezy.cn/pin',
    // pdUrl: 'http://172.16.81.103:8086/pin',
    // pdUrl: 'http://172.16.92.140:8085/pin',
    // pdUrl: 'http://140.210.69.189:8085/pin', // 测试库上端外商品

    //锦绣山河
    apiWonderfulUrl: 'http://api.pezy.cn/jinxiushanhe',
    // apiWonderfulUrl: 'http://172.16.92.140:8081/jinxiushanhe',
    // apiWonderfulGroupUrl:'http://172.16.75.58:6680/bc-activity-service',
    // apiBaseUrl: 'http://172.16.81.80:6680/bc-activity-service',


    //线上游戏接口url
    apiGameUrl: 'http://game.pezy.cn/server/game',
    // apiGameUrl: 'http://172.16.92.245:8080/server/game',
    // apiGameUrl:'http://172.16.92.97:8080/server/game',
    // apiGameUrl:'http://172.16.92.105:8080/server/game/',

    // 广告
    adUrl: 'http://boring.qknode.com/boring-oms',
    // adUrl: 'http://172.16.81.109:8012/boring-oms',

    //游戏前缀URL
    gameUrl:'http://game.pezy.cn',

    // newsBaseUrl: 'http://news.pezy.cn', // 新闻
    newsBaseUrl: 'http://static1.pezy.cn', // 新闻

    bizBaseUrl: 'http://bizapi.pezy.cn',

     //社区
    apiCommunityUrl: 'http://server.pezy.cn',
    // apiCommunityUrl: 'http://172.16.75.58:8003',

    //社区评论接口
    apiCommendUrl: 'http://bizapi.pezy.cn/comment',

    //用户信息
    apiUserUrl: 'http://api.pezy.cn/bc-activity-service/user/userInfoByGuid',

    // cdn 路径
    // cdn: `http://static1.pezy.cn/h5/app/${version}/`,
    cdn: ``,

    // 微下载
    // yinyongbao1102: `http://static1.pezy.cn/h5/app/${version}/`,

    appstore: 'https://itunes.apple.com/cn/app/%E4%BA%BF%E5%88%BB/id1027325728?mt=8',

    // 官网
    chan1009: {
        id: 1009,
        yyb: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.cnode.blockchain&ckey=CK1410200060510',
    },

    // 收徒
    chan1102: {
        id: 1102,
        yyb: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.cnode.blockchain&ckey=CK1399571607539',
    },

    // 正文页面
    chan1103: {
        id: 1103,
        yyb: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.cnode.blockchain&ckey=CK1400176745449',
    },

    // 预测帝
    chan1104: {
        id: 1104,
        yyb: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.cnode.blockchain&ckey=CK1401466175561',
    },

    // 游戏
    chan1105: {
        id: 1105,
        yyb: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.cnode.blockchain&ckey=CK1408046426954',
    },

    // 锦绣山河
    chan1106: {
        id: 1106,
        yyb: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.cnode.blockchain&ckey=CK1408046342965',
    },

    // 正文相关
    chan1107: {
        id: 1107,
        yyb: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.cnode.blockchain&ckey=CK1408046474409',
    },

    // 摇一摇活动
    chan1108: {
        id: 1108,
        yyb: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.cnode.blockchain&ckey=CK1408105756466',
    },

    // 中秋
    chan1300: {
        id: 1300,
        yyb: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.cnode.blockchain&ckey=CK1406840508898',
    },

    // 如懿转
    chan1301: {
        id: 1301,
        yyb: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.cnode.blockchain&ckey=CK1406148806857',
    },

    // 拼单
    chan1303: {
        id: 1303,
        yyb: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.cnode.blockchain&ckey=CK1409611065208',
    }
}
