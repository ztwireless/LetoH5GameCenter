// 新手任务
export const NEWUSER = {

    oneWithdrawal: {
        title: '1元提现',
        sub: '+1元<em class="icon-money"></em>',
        value: '1元',
        btn: '去提现',
        type: 'withdraw',
        image: '/images/task/newuser-9.png',
        text: '新手专享，现金余额满1元即可提现到支付宝账户，极速到账哦~',
        collapse: false,
        androidVersion: 100,
        iosVersion: 100,
        flag: 'money',
        status: 0,
    },

    newUserFirstViewWallet: {
        title: '查看钱包余额',
        sub: '+0.1元<em class="icon-money"></em>',
        value: '5000',
        btn: '去做任务',
        type: 'wallet',
        image: '/images/task/newuser-6.png',
        text: '在亿刻【红包】大厅和【我】的任意入口进入钱包，查看余额，即可获得奖励哦',
        collapse: false,
        taskType: 4013,
        androidVersion: 142,
        iosVersion: 142,
        flag: 'gold',
        status: 0,
    },

    newUserFirstReading: {
        title: '首次阅读文章',
        sub: '+0.1元<em class="icon-money"></em>',
        value: '5000',
        btn: '去做任务',
        image: '/images/task/newuser-4.png',
        type: 'first',
        text: '在【看点】里认真阅读任何一篇文章，即可获得奖励哦',
        collapse: false,
        taskType: 4011,
        androidVersion: 142,
        iosVersion: 142,
        flag: 'gold',
        status: 0,
    },

    bindWeChat: {
        title: '绑定微信',
        sub: '+0.1元<em class="icon-money"></em>',
        value: '0.1元',
        btn: '立即绑定',
        type: 'bindWechat',
        image: '/images/task/newuser-7.png',
        text: '绑定微信即可获得奖励',
        collapse: false,
        taskType: 4019,
        androidVersion: 148,
        iosVersion: 144,
        flag: 'gold',
        status: 0,
    },

    bindPhone: {
        title: '绑定手机号',
        btn: '立即绑定',
        type: 'bindphone',
        text: '绑定手机号会让您的账号使用更加安全，更有1元提现的专享特权。',
        collapse: false,
        androidVersion: 158,
        iosVersion: 154,
        status: 0,
    },

    joinWeChatGroup: {
        title: '加入官方微信群',
        sub: '+20000<em class="icon-gold"></em>',
        value: '20000',
        btn: '立即查看',
        type: 'joinWeChatGroup',
        image: '/images/task/newuser-7.png',
        text: '新用户加入官方微信群，即可领取2~30元红包。',
        collapse: false,
        androidVersion: 100,
        iosVersion: 100,
        flag: 'gold',
        status: 0,
    },

    newUserFirstGame: {
        title: '首次游戏奖励',
        sub: '+5000<em class="icon-gold"></em>',
        value: '5000',
        btn: '去做任务',
        type: 'newUserFirstGame',
        image: '/images/task/newuser-7.png',
        text: '新用户进入游戏大厅，完成一局游戏任务，即可领取奖励',
        collapse: false,
        androidVersion: 100,
        iosVersion: 100,
        flag: 'gold',
        status: 0,
        taskType: 4056,
    },

    newUserFirstIntWall: {
        title: '首次完成积分墙',
        sub: '+5000<em class="icon-gold"></em>',
        value: '5000',
        btn: '去做任务',
        type: 'newUserFirstIntWall',
        image: '/images/task/newuser-7.png',
        text: '新用户进入积分墙任务，完成一次任务，即可领取奖励',
        collapse: false,
        androidVersion: 100,
        iosVersion: 100,
        flag: 'gold',
        status: 0,
        taskType: 4057,
    },

    // firstAward: {
    //     title: '注册奖励',
    //     sub: '+1元<em class="icon-money"></em>',
    //     value: '1元',
    //     image: '/images/task/newuser-1.png',
    //     btn: '立即领取',
    //     type: 'plan',
    //     text: '新用户注册即可领取1元，人人有份快叫朋友来领取。',
    //     collapse: false,
    //     androidVersion: 103,
    //     iosVersion: 103,
    //     flag: 'money',
    //     status: 0,
    // },

    followAward: {
        title: '邀请红包',
        sub: '+1元<em class="icon-money"></em>',
        value: '1元',
        btn: '立即领取',
        image: '/images/task/newuser-2.png',
        type: 'plan',
        text: '您已经完成被邀请任务，点击即可领取1元邀请红包，现在去邀请好友可以赚更多现金。',
        collapse: false,
        androidVersion: 103,
        iosVersion: 103,
        flag: 'money',
        status: 0,
    },

    // newUserAnswerAward: {
    //     title: '新手答题奖励',
    //     sub: '+500<em class="icon-gold"></em>',
    //     value: '500',
    //     btn: '立即领取',
    //     image: '/images/task/newuser-3.png',
    //     type: 'newUser',
    //     text: '只要1分钟，轻松赚1元！快来完成新手答题，超快掌握任务技能，还能领红包！',
    //     collapse: false,
    //     androidVersion: 104,
    //     iosVersion: 104,
    //     flag: 'gold',
    //     status: 0,
    // },

    // newUserFirstViewReading: {
    //     title: '查看阅读收益',
    //     sub: '+0.1元<em class="icon-money"></em>',
    //     value: '0.1元',
    //     btn: '去做任务',
    //     image: '/images/task/newuser-5.png',
    //     type: 'read',
    //     text: '在文章正文页的右下角，点击阅读计时器查看阅读收益，即可获得奖励哦',
    //     collapse: false,
    //     taskType: 4012,
    //     androidVersion: 142,
    //     iosVersion: 142,
    //     flag: 'money',
    //     status: 0,
    // },

    firstFollowAward: {
        title: '新人必赚',
        sub: '+8元<em class="icon-money"></em>',
        value: '8元',
        btn: '去邀请',
        type: 'firstInvite9',
        image: '/images/task/newuser-7.png',
        text: '第一次成功邀请好友下载亿刻，可获得8元现金奖励返现！限时高额奖励。',
        collapse: false,
        androidVersion: 103,
        iosVersion: 103,
        flag: 'money',
        status: 0,
    },
};

// 福利任务
export const WELFARE = {
    feedbackMasterTask: {
        title: '邀请好友额外奖励',
        sub: '+N元<em class="icon-money"></em>',
        value: 'N元',
        btn: '去邀请',
        type: 'welfare',
        image: '/images/task/newuser-9.png',
        text: '邀请一位好友增加首日返现，高质量好友数量越多，首日返现越高，获得总额越多！完成后任务将自动关闭。',
        collapse: false,
        androidVersion: 100,
        iosVersion: 100,
        flag: 'money',
        status: 0,
    },
}

// 日常任务
export const DAILY = {
    // activity: {
    //     title: '38000元',
    //     sub: '现金红包<em class="icon-money"></em>',
    //     image: '/images/task/daily-0.png',
    //     btn: '点击领取',
    //     type: 'activity',
    //     text: '活动期间，邀请的活跃好友越多，获得的额外收益越多！最高奖励38000元！低门槛、高收益，稳赚！',
    //     collapse: false,
    //     androidVersion: 100,
    //     iosVersion: 100,
    // },

    // dailyFirstFollowAward: {
    //     title: '首次邀请福利',
    //     sub: '+2元<em class="icon-money"></em>',
    //     btn: '去邀请',
    //     type: 'firstInvite4',
    //     text: '第一次成功邀请好友下载亿刻，可获得10元现金奖励返现！限时高额奖励。',
    //     collapse: false,
    //     androidVersion: 100,
    //     iosVersion: 100,
    //     flag: 'money',
    // },

    game: {
        title: '金币奖励游戏(新)',
        sub: '无上限',
        specialValue: '+6000金币',
        value: '无上限',
        image: '/images/task/daily-1.png',
        btn: '马上去',
        type: 'game',
        text: '玩转小游戏，完成金币奖励游戏任务，得海量金币，无上限哦',
        specialText: '游戏广告观看奖励 6000',
        collapse: false,
        androidVersion: 104,
        iosVersion: 104,
        flag: 'gold',
    },

    integralWallTask: {
        title: '亿刻福利社',
        sub: '<span style="font-size: 14px">限时高额任务</span><em class="icon-money"></em>',
        value: '无上限',
        image: '/images/task/daily-11.png',
        btn: '立即进入',
        type: 'task',
        text: '亿刻官方会发布每日任务，用户按照引导流程进行操作，正确完成任务的用户即可领奖。',
        collapse: false,
        androidVersion: 152,
        iosVersion: 151,
        flag: 'gold',
    },

    inviteFollowAward: {
        title: '邀请好友',
        sub: '+7-10元<em class="icon-money"></em>',
        value: '7-10元',
        specialValue: '5元',
        // sub: '+7元<em class="icon-money"></em>',
        image: '/images/task/daily-4.png',
        btn: '现在邀请',
        type: 'plan',
        text: '邀一名好友，得7-10元！一年内有效！你来看新闻，我来赚零花。<em style="font-style: normal; color: #ff8040" class="goPlan">奖励如何发放>></em>',
        specialText: '邀一名好友，得5元！一年内有效！你来看新闻，我来赚零花。<em style="font-style: normal; color: #ff8040" class="goPlan">奖励如何发放>></em>',
        collapse: false,
        guide: 'plan',
        androidVersion: 100,
        iosVersion: 100,
        video: 'video',
        flag: 'money',
    },


    shake: {
        title: '摇一摇',
        sub: '+20元<em class="icon-money"></em>',
        value: '20元',
        image: '/images/task/daily-4.png',
        btn: '立刻前往',
        type: 'shake',
        text: '随时随地摇红包，每天简单分享，秒赚20元以上',
        collapse: false,
        androidVersion: 100,
        iosVersion: 100,
        flag: 'money',
    },

    // shareGuessAward: {
    //     title: '预测赚现金',
    //     sub: '+无上限<em class="icon-gold"></em>',
    //     image: '/images/task/daily-2.png',
    //     btn: '去发预测',
    //     type: 'guess',
    //     text: '玩预测帝，发布预测即可赚取输家奖池20%的金币！参与预测分更多金币！赚钱无上限~<em style="font-style: normal; color: #ff8040" class="goGuess">如何玩预测赚更多>></em>',
    //     isCoin: true,
    //     collapse: false,
    //     androidVersion: 103,
    //     iosVersion: 103,
    // },

    shareNewsAward: {
        title: '分享新闻',
        sub: '+15000<em class="icon-gold"></em>',
        value: '15000',
        image: '/images/task/daily-3.png',
        btn: '分享新闻',
        type: 'history',
        text: '分享新闻给朋友，当前最赚钱任务！被好友阅读可得300金币/次,每日上限15000金币！<em style="font-style: normal; color: #1DBF84" class="goShare">查看分享小妙招>>></em>',
        collapse: false,
        androidVersion: 140,
        iosVersion: 140,
        flag: 'gold',
    },

    readNewsAward: {
        title: '浏览新闻/视频',
        sub: '+3000<em class="icon-gold"></em>',
        value: '3000',
        image: '/images/task/daily-5.png',
        btn: '前往阅读',
        type: 'read',
        text: '5-8秒快速出币！稍微花点时间看新闻，可随机获得90金币/篇的奖励，最高可得每天3000金币的奖励呦！',
        collapse: false,
        androidVersion: 103,
        iosVersion: 103,
        flag: 'gold',
    },

    // shareIncomeObject: {
    //     title: '晒晒收入',
    //     sub: '+1200<em class="icon-gold"></em>',
    //     image: '/images/task/daily-6.png',
    //     btn: '立即分享',
    //     type: 'pic',
    //     text: '将收入分享至朋友圈，好友访问后，即可获得300金币/次的奖励，每天最高1200金币哦~',
    //     collapse: false,
    //     androidVersion: 104,
    //     iosVersion: 104,
    //     flag: 'gold',
    // },

    readPushNewsAward: {
        title: '阅读推文',
        sub: '+1800<em class="icon-gold"></em>',
        value: '1800',
        specialValue: '4500',
        image: '/images/task/daily-8.png',
        btn: '打开推送',
        type: 'push',
        text: '打开亿刻每天推送给你的文章，即可获得300金币/次的奖励，每天奖励1800金币封顶~',
        specialText: '打开亿刻每天推送给你的文章，即可获得300金币/次的奖励，每天奖励1800金币封顶~',
        collapse: false,
        androidVersion: 104,
        iosVersion: 104,
        flag: 'gold',
    },

    // shareFriendsFollowAward: {
    //     title: '分享邀请页',
    //     sub: '+900<em class="icon-gold"></em>',
    //     image: '/images/task/daily-7.png',
    //     btn: '立即分享',
    //     type: 'share',
    //     text: '分享邀请页至朋友圈，好友访问后，即可获得300金币/次的奖励，每天最高900金币哦~',
    //     collapse: false,
    //     androidVersion: 100,
    //     iosVersion: 100,
    //     flag: 'gold',
    // },

    pullNewsAward: {
        title: '【看点】领金币',
        sub: '+3000<em class="icon-gold"></em>',
        value: '3000',
        image: '/images/task/daily-1.png',
        btn: '去赚金币',
        type: 'read',
        text: '在【看点】浏览新闻，将获得随机金币奖励，每天最高3000金币哦~',
        collapse: false,
        androidVersion: 104,
        iosVersion: 104,
        flag: 'gold',
    },


    // readDesktopPush: {
    //     title: '阅读锁屏推送',
    //     sum: 400,
    //     sub: '+400<em class="icon-gold"></em> = 0.4元',
    //     //image: '/images/task/daily-9.png',
    //     btn: '开启',
    //     type: 'desktop',
    //     text: '点开锁屏时显示在你手机主页上的推送，阅读全文，即可随机获得10~40金币/次的奖励呦~多点多得！<em style="font-style: normal; color: #1DBF84" class="gotoPush">开启后无法正常显示></em>',
    //     collapse: false,
    //     version: 141,
    //     status: false,
    // },

    // readLivePush: {
    //     title: '阅读常驻推送',
    //     btn: '开启',
    //     sub: '+400<em class="icon-gold"></em> = 0.4元',
    //     //image: '/images/task/daily-9.png',
    //     type: 'live',
    //     text: '点开固定显示在你手机顶部的推送，阅读全文，即可随机获得10~40金币/次的奖励呦~多读多赚！<em style="font-style: normal; color: #1DBF84" class="gotoPush">开启后无法正常显示></em>',
    //     collapse: false,
    //     version: 141,
    //     status: false,
    // },
};

//赚钱攻略
export let STRATEGY_TASK = {
    inviteFollowAward: {
        title: '邀请好友',
        sub: '+50元<em class="icon-money"></em>',
        // sub: '+7元<em class="icon-money"></em>',
        image: '/images/task/daily-4.png',
        btn: '现在邀请',
        type: 'plan',
        text: '邀一名好友，得50元！一年内有效！你来看新闻，我来赚零花。<em style="font-style: normal; color: #ff8040" class="goPlan">奖励如何发放>></em>',
        // text: '每邀请一名好友下载亿刻，即可获得7元现金！奖励上不封顶，月入万元不是梦！<em style="font-style: normal; color: #ff8040" class="goPlan">奖励如何发放>></em>',
        collapse: false,
        guide: 'plan',
        androidVersion: 100,
        iosVersion: 100,
        video: 'video',
        flag: 'money',
    },

    shareNewsAward: {
        title: '分享新闻',
        sub: '当前最赚<em class="icon-gold"></em>',
        image: '/images/task/daily-3.png',
        btn: '分享记录',
        type: 'history',
        text: '分享新闻给朋友，当前最赚钱任务！分享既得10-100金币/次，被好友阅读可得500金币/次，同时你的邀请人，也能获得200金币/次。分享的越多，得金币越多！<em style="font-style: normal; color: #1DBF84" class="goShare">查看分享小妙招>>></em>',
        collapse: false,
        androidVersion: 140,
        iosVersion: 140,
        flag: 'gold',
    },

    // readNewsAward: {
    //     title: '阅读新闻',
    //     sub: '+3000<em class="icon-gold"></em>',
    //     image: '/images/task/daily-5.png',
    //     btn: '前往阅读',
    //     type: 'read',
    //     text: '5-8秒快速出币！稍微花点时间看新闻，可随机获得90金币/篇的奖励，最高可得每天5000金币的奖励呦！',
    //     collapse: false,
    //     androidVersion: 103,
    //     iosVersion: 103,
    //     flag: 'gold',
    // },

    // shareIncomeObject: {
    //     title: '晒晒收入',
    //     sub: '+1200<em class="icon-gold"></em>',
    //     image: '/images/task/daily-6.png',
    //     btn: '立即分享',
    //     type: 'pic',
    //     text: '将收入分享至朋友圈，好友访问后，即可获得300金币/次的奖励，每天最高1200金币哦~',
    //     collapse: false,
    //     androidVersion: 104,
    //     iosVersion: 104,
    //     flag: 'gold',
    // },

    readPushNewsAward: {
        title: '阅读推送',
        sub: '+1800<em class="icon-gold"></em>',
        value: '1800',
        image: '/images/task/daily-8.png',
        btn: '打开推送',
        type: 'push',
        text: '打开亿刻每天推送给你的文章，即可获得300金币/次的奖励，每天奖励1800金币封顶~',
        collapse: false,
        androidVersion: 104,
        iosVersion: 104,
        flag: 'gold',
    }
}

export let readDesktopPush = {
    title: '阅读锁屏推送',
    sum: 1800,
    sub: '+1800<em class="icon-gold"></em>',
    value: '1800',
    specialValue: 4500,
    btn: '开启',
    image: '/images/task/daily-9.png',
    type: 'desktop',
    text: '点开锁屏时显示推送，阅读全文，即可随机获得300金币/次的奖励！<em style="font-style: normal; color: #ff8040" class="gotoPush">开启后无法正常显示></em>',
    specialText: '点开锁屏时显示推送，阅读全文，即可随机获得300金币/次的奖励！<em style="font-style: normal; color: #ff8040" class="gotoPush">开启后无法正常显示></em>',
    collapse: false,
    status: false,
    androidVersion: 141,
    iosVersion: 141,
    flag: 'gold',
};

export let readLivePush = {
    title: '阅读常驻推送',
    btn: '开启',
    sub: '+1800<em class="icon-gold"></em>',
    value: '1800',
    specialValue: 4500,
    image: '/images/task/daily-10.png',
    type: 'live',
    text: '点开手机顶部固定显示的推送，阅读全文，即可随机获得300金币/次的奖励！<em style="font-style: normal; color: #ff8040" class="gotoPush">开启后无法正常显示></em>',
    specialText: '点开手机顶部固定显示的推送，阅读全文，即可随机获得300金币/次的奖励！<em style="font-style: normal; color: #ff8040" class="gotoPush">开启后无法正常显示></em>',
    collapse: false,
    status: false,
    androidVersion: 141,
    iosVersion: 141,
    flag: 'gold',
};

export let SPORTSGAME = [
    {
        id: 364729,
        name: '斗地主',
        publicity: '正版斗地主游戏！超多实物奖励的经典玩法（手环、平板等你来）！',
        icon: 'http://static1.pezy.cn/img/2019-04-26/381162331214516513.jpg',
    },

    {
        id: 364736,
        name: '桌球',
        publicity: '桌球游戏，经典再现，叱咤球坛',
        icon: 'http://static1.pezy.cn/img/2019-04-26/237686406527157134.jpg',
    },
]


export let specialChanId = [
    {

        title: '关注微信小程序',
        sub: '无上限',
        value: '无上限',
        specialValue: '无上限',
        image: '/images/task/daily-4.png',
        btn: '立即进入',
        type: 'mini',
        text: '轻轻松松赚取大量金币',
        specialText: '轻轻松松赚取大量金币',
        collapse: false,
        guide: 'plan',
        androidVersion: 100,
        iosVersion: 100,
        flag: 'gold',
    },
    {
        title: '游戏大厅（开宝箱）',
        sub: '6000',
        specialValue: '6000',
        value: '6000',
        image: '/images/task/daily-1.png',
        btn: '马上去',
        type: 'game',
        text: '玩小游戏，看游戏中视频，可获得100金币/次',
        specialText: '游戏广告观看奖励 6000',
        collapse: false,
        androidVersion: 104,
        iosVersion: 104,
        flag: 'gold',
        isShow: true,
    },
    {
        title: '阅读推送',
        value: '3600',
        specialValue: '4500',
        collapse: false,
        flag: 'gold',
        isShow: true,
        type: 'pushRead',
        task: [
            {
                title: '阅读推文',
                sub: '+1800<em class="icon-gold"></em>',
                value: '1800',
                specialValue: '4500',
                image: '/images/task/daily-8.png',
                btn: '打开推送',
                type: 'push',
                text: '打开亿刻每天推送给你的文章，即可获得300金币/次的奖励！',
                specialText: '打开亿刻每天推送给你的文章，即可获得300金币/次的奖励！',
                collapse: false,
                androidVersion: 104,
                iosVersion: 104,
                flag: 'gold',
            },
        ]
    },
    {
        title: '看点赚金币',
        value: '6000',
        specialValue: '8000',
        collapse: false,
        flag: 'gold',
        isShow: true,
        text: '',
        task: [
            {
                title: '阅读文章',
                btn: '前往阅读',
                type: 'read',
                text: '看点中阅读文章，即可获得60-90金币/次',
            },
            {
                title: '观看视频',
                btn: '前往观看',
                type: 'read',
                text: '看点中观看视频，即可获得60-90金币/次',
            },

            {
                title: '频道浏览',
                btn: '去赚金币',
                type: 'read',
                text: '看点中浏览各个频道，上拉下拉即可获得60-90金币/次',
            },
        ]
    },

    {
        title: '邀请好友',
        sub: '+7-10元<em class="icon-money"></em>',
        value: '7-10元',
        specialValue: '5元',
        image: '/images/task/daily-4.png',
        btn: '现在邀请',
        type: 'plan',
        text: '邀一名好友，得7-10元！一年内有效！你来看新闻，我来赚零花。<em style="font-style: normal; color: #ff8040" class="goPlan">奖励如何发放>></em>',
        specialText: '邀一名好友，得5元！一年内有效！你来看新闻，我来赚零花。<em style="font-style: normal; color: #ff8040" class="goPlan">奖励如何发放>></em>',
        collapse: false,
        guide: 'plan',
        androidVersion: 100,
        iosVersion: 100,
        video: 'video',
        flag: 'money',
    },
]



export let GAMESGOLD = [
    {
        id: 364733,
        name: '魔君天下',
        gold: '100/次',
        publicity: '金币任务',
        icon: 'http://download.mgc-games.com/access/upload/20190423/5cbe87b7d3153.png',
    },
    {
        id: 364732,
        name: '权倾天下',
        gold: '100/次',
        publicity: '金币任务',
        icon: 'http://download.mgc-games.com/access/upload/20190428/5cc5177af1499.png',
    },

    {
        id: 364540,
        name: '星星爱消乐',
        gold: '100/次',
        publicity: '金币任务',
        icon: 'http://mgc-games.com:8711/upload/20190319/5c91002cdf99d.jpg',
    },

    {
        id: 364364,
        name: '病毒危机',
        gold: '100/次',
        publicity: '病毒爆发后你选择拯救世界还是任由他传染呢？',
        icon: 'http://static1.qknode.com/img/2019-03-07/5713124467536392929.jpg',
    },

    {
        id: 364333,
        name: '大明皇朝',
        gold: '100/次',
        publicity: '金币任务（领取游戏币、漂浮奖励、升官、签到）',
        icon: 'http://mgc-games.com:8711/upload/20190227/5c764f580d180.jpg'
    },

    {
        id: 364352,
        name: '街机斗地主',
        gold: '100/次',
        publicity: '金币任务（签到、获取游戏币）',
        icon: 'http://mgc-games.com:8711/upload/20190319/5c909dc73468a.png',
    },

    {
        id: 364531,
        name: '穿越当皇上',
        gold: '100/次',
        publicity: '金币任务（获取道具）',
        icon: 'http://mgc-games.com:8711/upload/20190319/5c90f695e10b6.jpg'
    },

    {
        id: 364547,
        name: '拥挤城镇',
        gold: '100/次',
        publicity: '金币任务',
        icon: 'http://mgc-games.com:8711/upload/20190320/5c91ec16db047.jpg',
    },

    {
        id: 364541,
        name: '2048弹球',
        gold: '100/次',
        publicity: '金币任务',
        icon: 'http://mgc-games.com:8711/upload/20190319/5c9100818ba20.jpg',
    },

    {
        id: 364366,
        name: '消消方块',
        gold: '100/次',
        publicity: '金币任务',
        icon: 'http://mgc-games.com:8711/upload/20190319/5c909d8713107.png',
    },

    {
        id: 364543,
        name: '疯狂加一',
        gold: '100/次',
        publicity: '金币任务（获取道具）',
        icon: 'http://mgc-games.com:8711/upload/20190319/5c9101564524f.jpg'
    },

    {
        id: 364285,
        name: '消灭宝石',
        gold: '100/次',
        publicity: '金币任务（复活、使用道具、获取游戏币）',
        icon: 'http://mgc-games.com:8711/upload/20190304/5c7d314260cc4.png',
    },

    {
        id: 363958,
        name: '开心祖玛',
        gold: '100/次',
        publicity: '金币任务（获取星星、复活）',
        icon: 'http://mgc-games.com:8711/upload/20181206/5c08f9484a110.png',
    },


    {
        id: 364310,
        name: '吃鸡碰碰车',
        gold: '100/次',
        publicity: '金币任务（转盘、签到、试用皮肤）',
        icon: 'http://mgc-games.com:8711/upload/20190319/5c909cb3d5af7.png',
    },

    {
        id: 364306,
        name: '欢乐打豆豆',
        gold: '100/次',
        publicity: '金币任务',
        icon: 'http://mgc-games.com:8711/upload/20190319/5c909ce383dce.png'
    },

    {
        id: 364019,
        name: '开心跳跳',
        gold: '100/次',
        publicity: '金币任务',
        icon: 'http://mgc-games.com:8711/upload/20190227/5c7659c4729d5.png',
    },

    {
        id: 364535,
        name: '甜蜜抱抱',
        gold: '100/次',
        publicity: '金币任务（获取道具、签到、转盘抽奖）',
        icon: 'http://mgc-games.com:8711/upload/20190319/5c90fb7655070.jpg'
    },

    {
        id: 364334,
        name: '星球快跑',
        gold: '100/次',
        publicity: '金币任务',
        icon: 'http://mgc-games.com:8711/upload/20190227/5c764f4098032.png',
    },

    {
        id: 364542,
        name: '一笔成线',
        gold: '100/次',
        publicity: '金币任务（获取道具）',
        icon: 'http://mgc-games.com:8711/upload/20190319/5c91010bb77b6.jpg'
    },


    {
        id: 364280,
        name: '数字方块',
        gold: '100/次',
        publicity: '金币任务',
        icon: 'http://mgc-games.com:8711/upload/20190304/5c7d30fd26efe.png'
    },

    {
        id: 363967,
        name: '六角消消乐',
        gold: '100/次',
        publicity: '金币任务',
        icon: 'http://mgc-games.com:8711/upload/20181204/5c066822680c5.jpg'
    },


    {
        id: 363961,
        name: '开心BT弹球',
        gold: '100/次',
        publicity: '金币任务（获取道具）',
        icon: 'http://mgc-games.com:8711/upload/20190301/5c78e9105f3d6.png'
    },

    {
        id: 364017,
        name: '水果大乱斗',
        gold: '100/次',
        publicity: '金币任务（获取道具）',
        icon: 'http://mgc-games.com:8711/upload/20190227/5c765a9903e60.png'
    },

    {
        id: 364281,
        name: '百变方块',
        gold: '100/次',
        publicity: '金币任务',
        icon: 'http://mgc-games.com:8711/upload/20190304/5c7d30cf5f137.png',
    },


    {
        id: 364302,
        name: '星星消除',
        gold: '100/次',
        publicity: '金币任务',
        icon: 'http://mgc-games.com:8711/upload/20190319/5c909d0f05bfc.png',
    },

    {
        id: 363490,
        name: '西游后传',
        gold: '100/次',
        publicity: '金币任务',
        icon: 'http://mgc-games.com:8711/upload/20180915/5b9c886acd0fe.png',
    },

    {
        id: 363912,
        name: '分手达人',
        gold: '100/次',
        publicity: '金币任务',
        icon: 'http://mgc-games.com:8711/upload/20181101/5bdac0d812453.png',
    },

    {
        id: 364378,
        name: '刀剑大作战',
        gold: '100/次',
        publicity: '金币任务',
        icon: 'http://mgc-games.com:8711/upload/20190312/5c8720993a37e.png',
    },

    {
        id: 364287,
        name: '六边形拼图',
        gold: '100/次',
        publicity: '金币任务（获取金币）',
        icon: 'http://mgc-games.com:8711/upload/20190304/5c7d2ed78f002.png',
    },

    {
        id: 364286,
        name: '六边形消除',
        gold: '100/次',
        publicity: '金币任务',
        icon: 'http://mgc-games.com:8711/upload/20190304/5c7d2f4c173e9.png'
    },

    {
        id: 364350,
        name: '9章算数',
        gold: '100/次',
        publicity: '金币任务',
        icon: 'http://mgc-games.com:8711/upload/20190319/5c909bd3ab7f3.jpg',
    },

    {
        id: 363966,
        name: '超级连线',
        gold: '100/次',
        publicity: '金币任务（游戏币翻倍）',
        icon: 'http://mgc-games.com:8711/upload/20190314/5c8a2edfe8881.png',
    },

    {
        id: 363971,
        name: '开心灌篮',
        gold: '100/次',
        publicity: '金币任务',
        icon: 'http://mgc-games.com:8711/upload/20181206/5c08f024c1d72.png'
    },



    // {
    //     id: 364288,
    //     name: '层层逼近',
    //     gold: '100/次',
    //     publicity: '金币任务（获取复活币、复活）',
    //     icon: 'http://mgc-games.com:8711/upload/20190304/5c7d2e0e84142.png',
    // },

    // {
    //     id: 363958,
    //     name: '开心祖玛',
    //     gold: '100/次',
    //     publicity: '金币任务（获取星星、复活）',
    //     icon: 'http://mgc-games.com:8711/upload/20181206/5c08f9484a110.png',
    // },

    // {
    //     id: '',
    //     name: '超级连线',
    //     gold: '100/次',
    //     publicity: '金币任务',
    // },

    // {
    //     id: 364280,
    //     name: '数字方块',
    //     gold: '100/次',
    //     publicity: '金币任务',
    //     icon: 'http://mgc-games.com:8711/upload/20190304/5c7d30fd26efe.png',
    // },

    // {
    //     id: 364333,
    //     name: '大明皇朝',
    //     gold: '100/次',
    //     publicity: '金币任务（领取游戏币、漂浮奖励、升官、签到）',
    //     icon: 'http://mgc-games.com:8711/upload/20190227/5c764f580d180.jpg'
    // },

    // {
    //     id: 363968,
    //     name: '超级火炮',
    //     gold: '100/次',
    //     publicity: '金币任务',
    //     icon: 'http://mgc-games.com:8711/upload/20181207/5c09f5ddb3b88.png'
    // },
]

export const BANNES = [{
        "title": "打打",
        "pic": "http://mgc-games.com:8711/upload/20190312/5c877c7048aaf.png",
        "gameid": 363930,
        "name": "打打捕鱼-梦工厂",
    },
    {
        "title": "星星消除计划",
        "pic": "http://mgc-games.com:8711/upload/20190305/5c7deb1d35b2a.jpg",
        "gameid": 364302,
        "version": "2.0.0",
    },
    {
        "title": "吃鸡碰碰车",
        "pic": "http://mgc-games.com:8711/upload/20190305/5c7deb0bddea8.jpg",
        "gameid": 364310,
        "version": "2.3.2",
        "name": "吃鸡碰碰车-梦工厂",
    }
];


export const GAMES = [{
        "id": 12,
        "name": "精品美游",
        "gameList": [{
                "id": 363490,
                "name": "西游后传",
                "play_num": 17,
                "icon": "http://mgc-games.com:8711/upload/20180915/5b9c886acd0fe.png",
                "publicity": "一款西游记题材的游戏",
                "type_id": 743,
                "packageurl": "http://download.mgc-games.com/sdkgame/363490/xiyouhouchuan_pack.zip",
                "classify": 7,
                "deviceOrientation": "portrait",
                "is_big_game": 1,
                "apkurl": "http://download.mgc-games.com/sdkgame/xyhc_and_364381/xyhc_and_364381.apk",
                "adid": 364381,
                "is_cps": 1,
                "splash_pic": "http://download.mgc-games.com/default/splash.png",
                "version": "3.0.0",
                "ass_name": "西游后传",
                "is_keynote": 1,
                "is_more": 2,
                "is_kp_ad": 2,
                "show_tags": "16,39,42",
                "is_like": 2,
                "is_collect": 2,
                "share_pic": "/upload/20190311/5c861e5d4b282.png",
                "share_type": 1,
                "is_open_ad": 1,
                "is_sysreport": 1,
                "apkpackagename": "com.kx.xyhz",
                "add_game_win_page": "http://search.mgc-games.com:8711/index.php?s=index/addgametodesktop/gameid/363490/packagename/com.cnode.blockchain",
                "tags": [
                    "在线玩",
                    "男频",
                    "高智商"
                ],
                "share_title": "西游后传",
                "share_msg": "海量小游戏无需安装，即点即玩",
                "share_url": "http://search.mgc-games.com:8711/agent.php/Front/Reg/gameSharePage/gameid/363490/packagename/Y29tLmNub2RlLmJsb2NrY2hhaW4="
            },
            {
                "id": 364310,
                "name": "吃鸡碰碰车",
                "play_num": 0,
                "icon": "http://mgc-games.com:8711/upload/20190319/5c909cb3d5af7.png",
                "publicity": "《吃鸡碰碰车》激情砰砰，欢乐无限！",
                "type_id": 744,
                "packageurl": "http://download.mgc-games.com/sdkgame/364310/eatchickenandbumpintoacar_pack.zip",
                "classify": 7,
                "deviceOrientation": "portrait",
                "is_big_game": 1,
                "apkurl": "http://download.mgc-games.com/sdkgame/cjppc_and_364311/cjppc_and_364311.apk",
                "adid": 364311,
                "is_cps": 1,
                "splash_pic": "http://mgc-games.com:8711/upload/20190117/5c3f8f8051ac3.png",
                "version": "2.3.2",
                "ass_name": "吃鸡碰碰车",
                "is_keynote": 1,
                "is_more": 2,
                "is_kp_ad": 2,
                "show_tags": "10,13,16",
                "is_like": 2,
                "is_collect": 2,
                "share_pic": "/upload/20190301/5c78f8e030876.png",
                "share_type": 1,
                "is_open_ad": 1,
                "is_sysreport": 1,
                "apkpackagename": "com.qm.eatchickenandbumpintoacar",
                "add_game_win_page": "http://search.mgc-games.com:8711/index.php?s=index/addgametodesktop/gameid/364310/packagename/com.cnode.blockchain",
                "tags": [
                    "对战",
                    "IO",
                    "在线玩"
                ],
                "share_title": "吃鸡碰碰车",
                "share_msg": "海量小游戏无需安装，即点即玩",
                "share_url": "http://search.mgc-games.com:8711/agent.php/Front/Reg/gameSharePage/gameid/364310/packagename/Y29tLmNub2RlLmJsb2NrY2hhaW4="
            },
            {
                "id": 364383,
                "name": "指心捕鱼",
                "play_num": 0,
                "icon": "http://mgc-games.com:8711/upload/20190319/5c909e4f5d630.png",
                "publicity": "一款从没见过子弹如此宝贵的红包捕鱼产品！",
                "type_id": 1036,
                "packageurl": "http://download.mgc-games.com/sdkgame/364383/zhixinfish_pack.zip",
                "classify": 7,
                "deviceOrientation": "landscape",
                "is_big_game": 0,
                "apkurl": "",
                "adid": 0,
                "is_cps": 1,
                "splash_pic": "http://mgc-games.com:8711/upload/20190313/5c8896fb21f83.png",
                "version": "2.0.0",
                "ass_name": "指心捕鱼",
                "is_keynote": 1,
                "is_more": 2,
                "is_kp_ad": 2,
                "show_tags": "11,24,28",
                "is_like": 2,
                "is_collect": 2,
                "share_pic": null,
                "share_type": 1,
                "is_open_ad": 1,
                "is_sysreport": 1,
                "apkpackagename": null,
                "add_game_win_page": "http://search.mgc-games.com:8711/index.php?s=index/addgametodesktop/gameid/364383/packagename/com.cnode.blockchain",
                "tags": [
                    "捕鱼",
                    "斗地主",
                    "棋牌"
                ],
                "share_title": "指心捕鱼",
                "share_msg": "海量小游戏无需安装，即点即玩",
                "share_url": "http://search.mgc-games.com:8711/agent.php/Front/Reg/kxyxh/name/c3hreXhoX2FuZF8zNjQwMzZfMTIzNjY="
            },
            {
                "id": 364308,
                "name": "黑洞也疯狂",
                "play_num": 0,
                "icon": "http://mgc-games.com:8711/upload/20190308/5c821b860bb23.png",
                "publicity": "《黑洞也疯狂》是一款探索闯关类小游戏，游戏的玩法相当魔性，玩家需要不断的去开启你的吞噬模式。多玩家实时作战，猥琐发育，吞掉对手，绝地求生。",
                "type_id": 764,
                "packageurl": "http://download.mgc-games.com/sdkgame/364308/blackholefighting_pack.zip",
                "classify": 7,
                "deviceOrientation": "portrait",
                "is_big_game": 0,
                "apkurl": "",
                "adid": 364309,
                "is_cps": 1,
                "splash_pic": "http://mgc-games.com:8711/upload/20190304/5c7ce42c35dd7.png",
                "version": "1.0.1",
                "ass_name": "黑洞也疯狂",
                "is_keynote": 1,
                "is_more": 2,
                "is_kp_ad": 2,
                "show_tags": "10,13,16",
                "is_like": 2,
                "is_collect": 2,
                "share_pic": "/upload/20190227/5c7642fa6e021.png",
                "share_type": 1,
                "is_open_ad": 1,
                "is_sysreport": 1,
                "apkpackagename": "com.qm.blackholefighting",
                "add_game_win_page": "http://search.mgc-games.com:8711/index.php?s=index/addgametodesktop/gameid/364308/packagename/com.cnode.blockchain",
                "tags": [
                    "对战",
                    "IO",
                    "在线玩"
                ],
                "share_title": "黑洞也疯狂",
                "share_msg": "海量小游戏无需安装，即点即玩",
                "share_url": "http://search.mgc-games.com:8711/agent.php/Front/Reg/gameSharePage/gameid/364308/packagename/Y29tLmNub2RlLmJsb2NrY2hhaW4="
            },
            {
                "id": 364302,
                "name": "星星消除计划",
                "play_num": 0,
                "icon": "http://mgc-games.com:8711/upload/20190319/5c909d0f05bfc.png",
                "publicity": "全民玩转星星，消消乐趣无穷！",
                "type_id": 821,
                "packageurl": "http://download.mgc-games.com/sdkgame/364302/starelimination_pack.zip",
                "classify": 7,
                "deviceOrientation": "portrait",
                "is_big_game": 0,
                "apkurl": "",
                "adid": 364303,
                "is_cps": 1,
                "splash_pic": "http://mgc-games.com:8711/upload/20190305/5c7e165582b65.png",
                "version": "2.0.0",
                "ass_name": "星星消除计划",
                "is_keynote": 1,
                "is_more": 2,
                "is_kp_ad": 2,
                "show_tags": "9,12,14",
                "is_like": 2,
                "is_collect": 2,
                "share_pic": "/upload/20190305/5c7e1614c255b.png",
                "share_type": 1,
                "is_open_ad": 1,
                "is_sysreport": 1,
                "apkpackagename": "com.qm.starelimination",
                "add_game_win_page": "http://search.mgc-games.com:8711/index.php?s=index/addgametodesktop/gameid/364302/packagename/com.cnode.blockchain",
                "tags": [
                    "休闲",
                    "消除",
                    "单机"
                ],
                "share_title": "星星消除计划",
                "share_msg": "海量小游戏无需安装，即点即玩",
                "share_url": "http://search.mgc-games.com:8711/agent.php/Front/Reg/gameSharePage/gameid/364302/packagename/Y29tLmNub2RlLmJsb2NrY2hhaW4="
            },
            {
                "id": 364334,
                "name": "星球快跑",
                "play_num": 0,
                "icon": "http://mgc-games.com:8711/upload/20190227/5c764f4098032.png",
                "publicity": "痛斥那光阴的退缩吧，超越前方的那颗恒星！",
                "type_id": 822,
                "packageurl": "http://download.mgc-games.com/sdkgame/364334/planet runner_pack.zip",
                "classify": 7,
                "deviceOrientation": "portrait",
                "is_big_game": 0,
                "apkurl": "",
                "adid": 0,
                "is_cps": 1,
                "splash_pic": "http://mgc-games.com:8711/upload/20190304/5c7ce6af62f12.png",
                "version": "1.0.1",
                "ass_name": "星球快跑",
                "is_keynote": 1,
                "is_more": 2,
                "is_kp_ad": 2,
                "show_tags": "9,19,35",
                "is_like": 2,
                "is_collect": 2,
                "share_pic": "/upload/20190222/5c6fe809be3fb.png",
                "share_type": 1,
                "is_open_ad": 1,
                "is_sysreport": 1,
                "apkpackagename": null,
                "add_game_win_page": "http://search.mgc-games.com:8711/index.php?s=index/addgametodesktop/gameid/364334/packagename/com.cnode.blockchain",
                "tags": [
                    "休闲",
                    "益智",
                    "跑酷"
                ],
                "share_title": "星球快跑",
                "share_msg": "海量小游戏无需安装，即点即玩",
                "share_url": "http://search.mgc-games.com:8711/agent.php/Front/Reg/gameSharePage/gameid/364334/packagename/Y29tLmNub2RlLmJsb2NrY2hhaW4="
            },
            {
                "id": 364350,
                "name": "9章算数",
                "play_num": 0,
                "icon": "http://mgc-games.com:8711/upload/20190319/5c909bd3ab7f3.jpg",
                "publicity": "考验你的麻将基本功，13张麻将牌 算出听哪张，看看谁算的又快又准",
                "type_id": 820,
                "packageurl": "http://download.mgc-games.com/sdkgame/364350/jiuzhangsuanshu.zip",
                "classify": 7,
                "deviceOrientation": "portrait",
                "is_big_game": 0,
                "apkurl": "",
                "adid": 0,
                "is_cps": 1,
                "splash_pic": "http://mgc-games.com:8711/upload/20190226/5c74fe0560646.png",
                "version": 1,
                "ass_name": "9章算数",
                "is_keynote": 1,
                "is_more": 2,
                "is_kp_ad": 2,
                "show_tags": "9,18,28",
                "is_like": 2,
                "is_collect": 2,
                "share_pic": null,
                "share_type": 1,
                "is_open_ad": 1,
                "is_sysreport": 1,
                "apkpackagename": null,
                "add_game_win_page": "http://search.mgc-games.com:8711/index.php?s=index/addgametodesktop/gameid/364350/packagename/com.cnode.blockchain",
                "tags": [
                    "休闲",
                    "超难",
                    "棋牌"
                ],
                "share_title": "9章算数",
                "share_msg": "海量小游戏无需安装，即点即玩",
                "share_url": "http://search.mgc-games.com:8711/agent.php/Front/Reg/kxyxh/name/c3hreXhoX2FuZF8zNjQwMzZfMTIzNzg="
            },
            {
                "id": 364046,
                "name": "开心消一消2",
                "play_num": 0,
                "icon": "http://mgc-games.com:8711/upload/20181223/5c1f9a1352a58.png",
                "publicity": "开心消一消2",
                "type_id": 765,
                "packageurl": "http://download.mgc-games.com/sdkgame/364046/happydispel 2.zip",
                "classify": 7,
                "deviceOrientation": "portrait",
                "is_big_game": 0,
                "apkurl": "",
                "adid": 364066,
                "is_cps": 1,
                "splash_pic": "http://mgc-games.com:8711/upload/20181220/5c1b83dfcc1ef.png",
                "version": 1,
                "ass_name": "开心消一消2",
                "is_keynote": 1,
                "is_more": 2,
                "is_kp_ad": 2,
                "show_tags": "",
                "is_like": 2,
                "is_collect": 2,
                "share_pic": "/upload/20190305/5c7e374355607.png",
                "share_type": 1,
                "is_open_ad": 1,
                "is_sysreport": 1,
                "apkpackagename": "com.leto.game.kaixinxiaoxiao",
                "add_game_win_page": "http://search.mgc-games.com:8711/index.php?s=index/addgametodesktop/gameid/364046/packagename/com.cnode.blockchain",
                "tags": [],
                "share_title": "开心消一消2",
                "share_msg": "海量小游戏无需安装，即点即玩",
                "share_url": "http://search.mgc-games.com:8711/agent.php/Front/Reg/gameSharePage/gameid/364046/packagename/Y29tLmNub2RlLmJsb2NrY2hhaW4="
            }
        ]
    },
];

// 新游戏 数据
export const NEWGAMES = [
    {
        "id": 2,
        "name": "猜你喜欢",
        "gameList": [
            {
                "id": 364308,
                "name": "黑洞也疯狂",
                "play_num": 0,
                "icon": "http://download.mgc-games.com/access/upload/20190308/5c821b860bb23.png",
                "publicity": "操控黑洞吞噬所有，包括你的对手！",
            },
            {
                id: 364547,
                name: '拥挤城镇',
                gold: '100/次',
                publicity: '金币任务',
                icon: 'http://mgc-games.com:8711/upload/20190320/5c91ec16db047.jpg',
            },
            {
                id: 364352,
                name: '街机斗地主',
                gold: '100/次',
                publicity: '金币任务（签到、获取游戏币）',
                icon: 'http://mgc-games.com:8711/upload/20190319/5c909dc73468a.png',
            },
            {
                "id": 363971,
                "name": "开心灌篮",
                "play_num": 0,
                "icon": "http://download.mgc-games.com/access/upload/20181206/5c08f024c1d72.png",
                "publicity": "大满贯，是时候来秀一波操作啦～",
            },
            {
                id: 364350,
                name: '9章算数',
                gold: '100/次',
                publicity: '金币任务',
                icon: 'http://mgc-games.com:8711/upload/20190319/5c909bd3ab7f3.jpg',
            },
        ]
    },
    {
        "id": 0,
        "name": "赚金币",
        "gameList": [
            {
                title: "星星消除计划",
                pic: "http://mgc-games.com:8711/upload/20190305/5c7deb1d35b2a.jpg",
                gameid: 364302,
                "publicity": '金币任务',
            },
            {
                id: 364019,
                name: '开心跳跳',
                publicity: '金币任务',
                icon: 'http://mgc-games.com:8711/upload/20190227/5c7659c4729d5.png',
            },
            {
                id: 363961,
                name: '开心BT弹球',
                publicity: '金币任务（获取道具）',
                icon: 'http://mgc-games.com:8711/upload/20190301/5c78e9105f3d6.png'
            },
            {
                "id": 364289,
                "name": "数字传奇",
                "play_num": 0,
                "icon": "http://download.mgc-games.com/access/upload/20190304/5c7d2dafc6aaf.png",
                "publicity": "手指滑动，挑战无线数字，乐趣升级！",
            },
            {
                id: 364285,
                name: '消灭宝石',
                gold: '100/次',
                publicity: '金币任务（复活、使用道具、获取游戏币）',
                icon: 'http://mgc-games.com:8711/upload/20190304/5c7d314260cc4.png',
            },
            {
                "id": 364017,
                "name": "开心水果大乱斗",
                "play_num": 0,
                "icon": "http://download.mgc-games.com/access/upload/20190227/5c765a9903e60.png",
                "publicity": "全新切水果玩法，各种道具酷到不行，好玩到爆！",
            },
            {
                "id": 364541,
                "name": "2048弹球高手",
                "play_num": 0,
                "icon": "http://download.mgc-games.com/access/upload/20190319/5c9100818ba20.jpg",
                "publicity": "2048弹球高手"
            },
            {
                "id": 363937,
                "name": "史上最坑爹的游戏12",
                "play_num": 0,
                "icon": "http://download.mgc-games.com/access/upload/20190227/5c765c6518ac6.png",
                "publicity": "追女日记悄悄来袭，意想不到的套路",
            },
        ]
    },
    {
        "id": 0,
        "name": "年度榜单",
        "gameList": [
            {
                id: 364540,
                name: '星星爱消乐',
                gold: '100/次',
                publicity: '金币任务',
                icon: 'http://mgc-games.com:8711/upload/20190319/5c91002cdf99d.jpg',
            },
            {
                id: 364364,
                name: '病毒危机',
                gold: '100/次',
                publicity: '病毒爆发后你选择拯救世界还是任由他传染呢？',
                icon: 'http://static1.qknode.com/img/2019-03-07/5713124467536392929.jpg',
            },
            {
                id: 364310,
                name: '吃鸡碰碰车',
                gold: '100/次',
                publicity: '金币任务（转盘、签到、试用皮肤）',
                icon: 'http://mgc-games.com:8711/upload/20190319/5c909cb3d5af7.png',
            },
        ]
    },
    {
        "id": 0,
        "name": "年度榜单",
        "gameList": [
            {
                "id": 364542,
                "name": "一笔成线",
                "play_num": 0,
                "icon": "http://download.mgc-games.com/access/upload/20190319/5c91010bb77b6.jpg",
                "publicity": "一笔成线",
            }
        ]
    },
    {
        "id": 0,
        "name": "新款上线",
        "gameList": [
            {
                "id": 364333,
                "name": "大明皇朝",
                "play_num": 0,
                "icon": "http://download.mgc-games.com/access/upload/20190227/5c764f580d180.jpg",
                "publicity": "大明皇朝是一款合成养成类的宫斗游戏。1.2亿人都在玩的穿越小游戏，穿越到大明，亲自处理朝政！",
            },
            {
                "id": 364306,
                "name": "欢乐打豆豆",
                "play_num": 0,
                "icon": "http://download.mgc-games.com/access/upload/20190319/5c909ce383dce.png",
                "publicity": "不让吃饭？OK！不让睡觉，也OK，不让打豆豆，那是不可能的！",
            },
            {
                "id": 363958,
                "name": "开心祖玛",
                "play_num": 0,
                "icon": "http://download.mgc-games.com/access/upload/20181206/5c08f9484a110.png",
                "publicity": "让人着迷的金典祖玛玩法，无尽闯关乐趣无穷！",
            },
            {
                id: 363912,
                name: '分手达人',
                publicity: '金币任务',
                icon: 'http://mgc-games.com:8711/upload/20181101/5bdac0d812453.png',
            },
            {
                "id": 364366,
                "name": "消消方块传奇",
                "play_num": 0,
                "icon": "http://download.mgc-games.com/access/upload/20190319/5c909d8713107.png",
                "publicity": "纵横变换消除，创意益智休闲！"
            },
            {
                "id": 364046,
                "name": "开心消一消2",
                "play_num": 0,
                "icon": "http://download.mgc-games.com/access/upload/20181223/5c1f9a1352a58.png",
                "publicity": "触动之间，体验消除的快感！",
            },
            {
                "id": 364383,
                "name": "指心捕鱼",
                "play_num": 0,
                "icon": "http://download.mgc-games.com/access/upload/20190319/5c909e4f5d630.png",
                "publicity": "一款从没见过子弹如此宝贵的红包捕鱼产品！",
            },
            {
                "id": 364676,
                "name": "欢乐小农场之疯狂田田",
                "play_num": 0,
                "icon": "http://download.mgc-games.com/access/upload/20190409/5cac2af1bc850.png",
                "publicity": "《欢乐小农场之疯狂田田》（简称《欢乐小农场》）是一款可爱的农场类经营游戏。在游戏中，你将在手机屏幕内管理一个微型农场，不停的收获农作物，并且用收获来的资金解锁新的地块。你的农场将逐渐充满各种各样的农作物和动物!游戏采用竖版单手操作的模式，可以方便用户随时打开手机进行游戏。同时引入了大量的经营和社交类游戏要素，使游戏在充满了趣味性的同时，也有与其他玩家进行交互的乐趣。\r\n\r\n玩法介绍\r\n\r\n1，收获",
            },
            {
                "id": 364287,
                "name": "六边形拼图",
                "play_num": 0,
                "icon": "http://download.mgc-games.com/access/upload/20190304/5c7d2ed78f002.png",
                "publicity": "方块于平涂的绝妙搭配，神秘的智力大考验。"
            },
        ]
    },
]


export let worldcupShare = [{
        title: '我看好这支球队胜算大！伙计们来下方支持一下666',
        desc: '好友们都开始转战亿刻APP，你也别out啦，世界杯这场比赛我选的球队支持一下！',
    },
    {
        title: '世界杯看球不如猜球嗨，我看好这支球队，进来顶我！',
        desc: '球迷真伪不重要玩的开心才重要，下载有趣的亿刻APP，助力你的球队！',
    },
    {
        title: 'word天，著名大V老梁也在亿刻app猜冠军，我跟一波。',
        desc: '来啊，躁动的我的心啊！快下载亿刻app，还能收获更多知识财富！',
    },
    {
        title: '世界杯猜冠军用亿刻，RMB的奖励已经拿到，赞！',
        desc: '推荐给你们，下载亿刻app，没错这就是一个毫无保留的我！',
    },
    {
        title: '盆友，帮帮忙，支持下我的球队就能领RMB啦！',
        desc: '著名大V老梁推荐的世界杯猜球互动应用，下载亿刻app，和老梁侃球！',
    },
];


// 摇一摇
export let luckyShare = [{
        title: '今天啥也没干，一直在亿刻摇一摇领现金！',
        desc: '下载玩亿刻，每日摇摇乐！现金红包拿不停！',
    }
    // {
    //     title: '每日整点摇一摇！亿刻老板天天送PhoneXS！',
    //     desc: '下载玩亿刻，整点摇摇乐！50万现金摇到手！',
    // },
    // {
    //     title: '整点不一样的，亿刻每日整点摇红包！',
    //     desc: '奖金全收~亲朋好友一起摇，iPhoneXS+50万现金红包！',
    // },
    // {
    //     title: '啊啊啊啊啊！我摇中了iPhoneXS！',
    //     desc: '整点摇现金大奖！100%中奖，50万现金大奖+iPhoneXS！',
    // },
    // {
    //     title: '用亿刻摇一摇 50万现金+iPhoneXs天天送！',
    //     desc: '玩游戏赢取现金大奖！万元奖金等你来拿！',
    // },
];

// 竞猜
export let guessTitle = '【预测领现金】';
export let guessDesc = [{
        num: 0,
        desc: '今日老夫掐指一算，出得此题！与我一起瓜分金币！',
    },
    {
        num: 1,
        desc: '用亿刻玩预测，是治疗一切贫穷的良药！',
    },
    {
        num: 2,
        desc: '别的小朋友都下载亿刻玩预测了，你什么时候下载吖~',
    },
    {
        num: 3,
        desc: '打开这道题，你就是我的人了，开奖赢钱算你一份！',
    },
    {
        num: 4,
        desc: '我在亿刻预测已经开奖5次了，你下载就能领奖金！',
    },
    {
        num: 5,
        desc: '今天不答题，明天变垃圾！快来预测领红包~',
    },
    {
        num: 6,
        desc: '上亿刻玩预测，我已经提现100元了，快来答题吖~',
    },
    {
        num: 7,
        desc: '你喜欢钱吗！那你一定会喜欢玩亿刻预测，懂得入！',
    },
    {
        num: 8,
        desc: '忍不住笑出声，每天开奖领红包！最近最火的游戏！',
    },
    {
        num: 9,
        desc: '玩预测领红包，还剩1个名额，速进！',
    },
    {
        num: 10,
        desc: '恭喜您预测结果正确，点这里领取金币！',
    },
    {
        num: 11,
        desc: '预测金币已经准备好，你准备好了么？',
    },
]

// 邀请好友
export let planShare = [
    // {
    //     num: 0,
    //     title: '来啊快活啊，反正有亿刻，2018致富小神器了解一下',
    //     desc: '下载亿刻app，时间就是金钱！微信好友都在用啦！',
    // },
    // {
    //     num: 1,
    //     title: '我有亿刻，你有故事吗？反正这里有福利，到账还快。',
    //     desc: '作为一个长者，告诉你现在下载亿刻app邀请好友是有多明智！',
    // },
    // {
    //     num: 2,
    //     title: '工资不够花，来玩亿刻啊！',
    //     desc: '哈哈哈哈哈，全新亿刻app用了我点赞！快告诉我这不是真的！',
    // },
    // {
    //     num: 3,
    //     title: '来亿刻app玩点不一样，花式挣工资，我笑而不语~',
    //     desc: '因为我在亿刻邀请好友、猜球、抢金币，福/利是真不少，到账速度！就问你来不来！',
    // },
    // {
    //     num: 4,
    //     title: '在吗，告诉你一个闷声发财新路子，不想发财的不要点。',
    //     desc: '别怪我今天不是人，只怪亿刻太迷人！亿刻app低调的土豪啊！',
    // },
    // {
    //     num: 5,
    //     title: '快来亿刻邀请好友领福利！4~30元红包秒到账！亲测有效~',
    //     desc: '亲朋好友一起领福袋，每3小时金币红包雨，做低调土豪，拿红包，迅速致富！',
    // },
    // {
    //     num: 6,
    //     title: '一亿红包秒到账，邀请好友、预测、阅读新闻都能领红包！',
    //     desc: '亿刻app撒币啦！下载领4.5元，超级福利零门槛，领取红包超轻松！',
    // },
    // {
    //     num: 7,
    //     title: '亿刻奖金领取通知，先发1个亿立刻提现！',
    //     desc: '群友们不要试图和福利过不去，毕竟亿刻发的都是些赤裸裸的RMB！下载亿刻APP，领取！',
    // },
    // {
    //     num: 8,
    //     title: '来亿刻财神附体，送你3-30元打开领取。',
    //     desc: '终于找到组织了对不对，来亿刻组团挖金币兑换RMB，10+万人已经下载。',
    // },
    // {
    //     num: 9,
    //     title: '我已收到亿刻奖金3-30元，安全可放心使用！',
    //     desc: '下载亿刻app，看看你的亿刻钱包有多少了。',
    // },
    // {
    //     num: 10,
    //     title: '来亿刻，每一个你邀请的好友都是爱你的形状~',
    //     desc: '下载亿刻APP，输入我邀请码，我5块你3块，我再给你发红包。',
    // },
    // {
    //     num: 11,
    //     title: '这个平台太火了，好友都在这里刷金币，快来一起！',
    //     desc: '我已经用了好几个星期了，忍不住推荐给你>>>'
    // },
    // {
    //     num: 12,
    //     title: '来和我一起邀请好友领金币！7天养成一个好习惯！',
    //     desc: '七姑八婶一起看资讯，还能领奖金！'
    // },
    // {
    //     num: 13,
    //     title: '我玩亿刻好久了，送个福袋给你！',
    //     desc: '靠谱推荐，进入可领新人奖励>>>'
    // },
    // {
    //     num: 14,
    //     title: '2018火爆全国的软件了解一下？',
    //     desc: '你周围的人都在用，千万别落伍！'
    // },
    // {
    //     num: 15,
    //     title: '这是我用过的最好玩的软件了！有趣又能拿好处！',
    //     desc: '看资讯、玩预测、拿奖励三合一！'
    // },
    // {
    //     num: 16,
    //     title: '打发时间神器—亿刻app，有趣又有赚！',
    //     desc: '亲测好玩，靠谱推荐，新人玩奖励更多！'
    // },
    // {
    //     num: 17,
    //     title: '邀请你加入“亿刻福利粉丝群”，进入可查看详情>>',
    //     desc: '发预测超好玩，跟我一起瓜分奖池赢金币！'
    // },
    // {
    //     num: 18,
    //     title: '邀请你加入“福利团”，福利多多，先到先得，点此入>>>',
    //     desc: '就剩3个席位，手慢无！'
    // },
    // {
    //     num: 19,
    //     title: '【仅剩2个名额】跟我加入亿刻大家庭，收徒赚金币！',
    //     desc: '勤分享，赚更多！'
    // },
    // {
    //     num: 20,
    //     title: '疯狂福利，奖励空前！点我领福袋>>>',
    //     desc: '亲测有效，新人注册即可领取！'
    // },
    // {
    //     num: 21,
    //     title: '亿刻奖金领取通知，先发1个亿立刻提现！',
    //     desc: '朋友们不要试图和福利过不去，毕竟亿刻发的都是些赤裸裸的RMB！下载亿刻APP，领取！'
    // },
    // {
    //     num: 22,
    //     title: '来亿刻财神附体，送你3-30元打开领取。',
    //     desc: '终于找到组织了对不对，来亿刻组团挖金币兑换RMB，10万+人已经下载。'
    // },
    // {
    //     num: 23,
    //     title: '我已收到亿刻奖金3-30元，安全可放心使用！',
    //     desc: '下载亿刻app，看看你的亿刻钱包有多少了。'
    // },
    // {
    //     num: 24,
    //     title: '来亿刻，邀请好友都是爱你的形状~',
    //     desc: '下载亿刻APP，输入我邀请码，我5块你4块，我再给你发红包。'
    // },
    // {
    //     num: 25,
    //     title: '自觉下载！谢谢，我给你们发红包的钱都在这赚的，我会说？',
    //     desc: '你们敢不敢给面子点一下我的链接，不要逼我私信你们呦~'
    // },
    // {
    //     num: 26,
    //     title: '嗨，在吗？帮我下载一个软件呗？真的能赚钱！',
    //     desc: '你们下了也别删，没事在里面玩玩，咱俩都能赚钱了~'
    // },
    // {
    //     num: 27,
    //     title: '聪明的小宝贝跟我一起下载，月底有肉吃，有酒喝~',
    //     desc: '保住月光族一条命！赚钱买的方便面有时候下个月的都吃不完，不吹牛！'
    // },
    {
        num: 28,
        title: '一起下载这个app吧！感觉挺靠谱，真能赚钱，我都提现了。',
        desc: '推荐你们也用一下，有什么不懂不会的都可以找我。'
    },
    // {
    //     num: 29,
    //     title: '这个app有毒！邀请好友真的太好赚了！点我链接下载！',
    //     desc: '我赚了钱给你们发红包！立帖为证！装了就卸载的不算数！'
    // },
    // {
    //     num: 30,
    //     title: '用亿刻两个月了，多种赚钱任务，每天随便看看都能领红包。',
    //     desc: '真心不错推荐给大家，点我链接去下载，即可领4.5元。'
    // },
    // {
    //     num: 31,
    //     title: '我这有一个可以快速致富的方法，了解下>>>',
    //     desc: '不可思议这款软件既然能赚到万元，0门槛，提现快，支付宝到账'
    // },
    // {
    //     num: 32,
    //     title: '38000元等你来拿，还在等什么？',
    //     desc: '98%的人已经成功提现，你还在等什么？'
    // },
    // {
    //     num: 33,
    //     title: '不服来战，38000元有能力你就拿走',
    //     desc: '实实在在的收益，真实有效，等你来参加！'
    // },
    // {
    //     num: 34,
    //     title: '这是一款老板送钱的APP，98%的人已经提现成功',
    //     desc: '真现金，支付宝到账，快来参加吧！'
    // },
    // {
    //     num: 35,
    //     title: '邀请好友就送钱!每个人都有赚38000的机会',
    //     desc: '喜大普奔！邀好友，送现金支付宝到账，邀请的朋友越多赚的越多'
    // },
    // {
    //     num: 36,
    //     title: '参与活动立即提现100元',
    //     desc: '0门槛，100%可提现'
    // },
    // {
    //     num: 37,
    //     title: '邀请下载满10人送100元，还等什么？',
    //     desc: '官方撒钱啦！手快有，手慢无！立即下载领取>>>'
    // },
    // {
    //     num: 38,
    //     title: '我已经邀请了9人，差一人我就能提现100了，朋友帮帮忙~',
    //     desc: '活动真实有效！门槛低，提现快 ！这个平台进钱真的好快呀。朋友们抓紧吧'
    // },
    // {
    //     num: 39,
    //     title: '帮我注册下我就能提现100元，你注册领4.5元！',
    //     desc: '100%得现金，0门槛提现，注册即送现金!'
    // },
    // {
    //     num: 40,
    //     title: '帮我注册下我就能提现100元，你注册领3元！',
    //     desc: '100%得现金，0门槛提现，注册即送现金!'
    // },
    // {
    //     num: 41,
    //     title: '你的好友向你发起了38000元的提现邀请',
    //     desc: '绝对的真实有效!立马提现。'
    // },
    // {
    //     num: 42,
    //     title: '无限次提现秒到账！',
    //     desc: '玩亿刻邀请十个好友！钱包余额随便提！'
    // },
    // {
    //     num: 43,
    //     title: '玩亿刻抢腾讯视频VIP会员！',
    //     desc: '9月10日活动开启连续四周，快人一步先到先得！'
    // },
    // {
    //     num: 44,
    //     title: '玩亿刻超高奖金等你拿！',
    //     desc: '距离100元现金红包还有一步之遥，立即领取！'
    // },
    // {
    //     num: 45,
    //     title: '日赚万元的秘密就在这里~',
    //     desc: '亿刻app活动奖励领不完，赚钱就是这么简单!'
    // },
    // {
    //     num: 46,
    //     title: '你好，在吗？最后时限，签到可入账。',
    //     desc: '你的余额已涨了，零钱可提现，赶紧去收钱~'
    // },
    // {
    //     num: 47,
    //     title: '亿刻签到获福利，要想红包变鼓，离不开这步~',
    //     desc: '点开有机会获得100元现金提现奖励，还等什么立即提现！'
    // },
    // {
    //     num: 48,
    //     title: '限时金币翻倍领！我敢送你敢领吗？ ',
    //     desc: '阅读，签到，奖励全翻倍！多重福利总有一款适合你'
    // },
    // {
    //     num: 49,
    //     title: '亿刻本轮奖励已到，一小时有效。',
    //     desc: '天上掉馅饼啦！全网最高现金兑换奖励，先到先得！'
    // },
    // {
    //     num: 50,
    //     title: '玩亿刻，预测赚现金无上限！',
    //     desc: '轻松赚现金，提现秒到账，好玩又赚钱'
    // },
    // {
    //     num: 51,
    //     title: '金币有的是，拿去花！ ',
    //     desc: '菜价上涨，穷的连菜都买不起了？没事，所有金币翻倍送，轻松赚出买菜钱~'
    // },
    // {
    //     num: 52,
    //     title: '您的好友正在使用亿刻app提现。',
    //     desc: '现在打开今天还可领取100元现金奖励，快来提现！ '
    // },
    // {
    //     num: 53,
    //     title: '亿刻给您发了一个红包，速来领取！ ',
    //     desc: '最高得100元现金，可立即提现！秒到账！'
    // },
    // {
    //     num: 54,
    //     title: '赚钱的秘诀曝光了，他们都来抢！',
    //     desc: '玩亿刻app金币翻倍，还赠赚钱秘籍，月入上万很轻松~'
    // },
    // {
    //     num: 55,
    //     title: '不小心发现了一个净赚100元的漏洞。',
    //     desc: '告诉你个小秘密：打开亿刻可以领取100元现金哦，不用谢！'
    // },
    {
        num: 56,
        title: '亿刻为你缴电费！赏金秒到账~',
        desc: '最高100元奖励，有能力都拿走！速来提现！'
    },
    // {
    //     num: 57,
    //     title: '恭喜您获得100元现金，可立即提现！',
    //     desc: '秒到账，先到先得，大额现金赚到没朋友，速来领取！'
    // },
    // {
    //     num: 58,
    //     title: '我分享出来，就是让你戳进来领钱的！',
    //     desc: '邀请好友赚现金，秒到账！玩亿刻年底买宝马！'
    // },
    // {
    //     num: 59,
    //     title: '以前我等钱，现在钱等我！',
    //     desc: '玩亿刻提现无上限，进来点击就送3-100元现金奖励，提现秒到账~'
    // },
    // {
    //     num: 60,
    //     title: '出行还在找单车？玩意亿刻领现金赚打车钱！秒到账！',
    //     desc: '还没下载亿刻？手机白买了吧，这app有毒，一玩就上瘾根本停不下来！'
    // },
    // {
    //     num: 61,
    //     title: '亿刻全场涨价！邀请2人得30元！',
    //     desc: '在亿刻可以无限提现！即提即到！行业第一！'
    // },
    // {
    //     num: 62,
    //     title: '邀好友，赚15元！',
    //     desc: '每人15元，上不封顶，极速提现瞬间到账，更多福利尽在亿刻！'
    // },
    // {
    //     num: 63,
    //     title: '你的亿刻好友邀请你就赚了15元！',
    //     desc: '手把手教你如何快速赚100元，靠谱推荐，详情点击>>>'
    // },
    // {
    //     num: 64,
    //     title: '我已拿到15元，快点一下，你也得现金>>>',
    //     desc: '0门槛拿现金，极速提现！每周一百，还能更多！'
    // },
    // {
    //     num: 65,
    //     title: '邀请你加入“读新闻领现金”专享群，点击加入>>>',
    //     desc: '下载亿刻，福利无限，新闻阅读5~8秒即可出币，更多惊喜等着你'
    // },
    // {
    //     num: 66,
    //     title: '想要了解最火的新闻阅读软件，请点击>>>',
    //     desc: '阅读新闻能拿钱，攒够金币可提现，每周一提速到账，红包福利在身边。 '
    // },
    // {
    //     num: 67,
    //     title: '动动手指，轻点一下，日赚百元不是梦！',
    //     desc: '邀请好友奖励领不完，赚钱从未如此简单！提现从未如此方便！'
    // },
    // {
    //     num: 68,
    //     title: '身边的人都在用它赚零花钱，想要了解请点击>>>',
    //     desc: '邀请好友奖励多多！现金已备好，你准备好了么？'
    // },
    // {
    //     num: 69,
    //     title: '亿刻app撒金币啦！下载立得4.5元',
    //     desc: '教你如何轻松拿到4.5元，亲测有效，立刻下载>>>'
    // },
    // {
    //     num: 70,
    //     title: '你有一份4.5元的红包即将到账',
    //     desc: '下载即有4.5元，走过路过不要错过，立即领取。'
    // },
    // {
    //     num: 71,
    //     title: '看新闻得红包，每天都有零钱花',
    //     desc: '阅读5~8秒即可出金币，极速提现，赚钱就是快！'
    // },
    // {
    //     num: 72,
    //     title: '月入六万六的项目了解一下？',
    //     desc: '邀请1个好友奖励7元，更有额外现金奖励！快来下载~',
    // },
    // {
    //     num: 73,
    //     title: '【公告】“大师傅”66000元悬赏',
    //     desc: '邀请好友玩亿刻，最高赚到六万六！人缘好，吃饱又吃好！',
    // },
    // {
    //     num: 74,
    //     title: '我今天啥也没干，光在亿刻看新闻了～',
    //     desc: '拉人头，拿赏银！玩亿刻，看新闻的同时还能赚大钱！',
    // },
    // {
    //     num: 75,
    //     title: '邀好友玩亿刻，领六万六现金红包。',
    //     desc: '阅读新闻就能赚钱，每天早饭钱都有了',
    // },
    // {
    //     num: 76,
    //     title: '下载亿刻先送4.5元，越玩越挣钱，提现秒到账～',
    //     desc: '邀请好友送现金，邀2名，送30元，多邀多得',
    // },
    // {
    //     num: 77,
    //     title: '新用户限时奖励，注册就送4.5元～',
    //     desc: '亿刻双11送大礼，天天瓜分100万',
    // },
    // {
    //     num: 78,
    //     title: '阅读，游戏，预测，邀请好友都能赚钱～',
    //     desc: '动动手每天赚钱无上限，能力越强，赚的越多',
    // },
    {
        num: 79,
        title: '下载亿刻，一人使用，全家变豪',
        desc: '有钱有钱巨有钱',
    },
    // {
    //     num: 80,
    //     title: '11.11马上来了，购物车放满了么？',
    //     desc: '下载玩亿刻，你的购物车，亿刻给你清空了',
    // },
    {
        num: 81,
        title: '活动奖励余额【2,000,000】元',
        desc: '点击速抢～',
    },
    // {
    //     num: 82,
    //     title: '亿刻双11送礼，狂撒100万～',
    //     desc: '现在点击链接下载，注册随机送5-100元',
    // },
    // {
    //     num: 83,
    //     title: '注册先送4.5元，多邀一名好友再送7元，上不封顶',
    //     desc: '金秋活动同步举行，最高额外奖励66000元',
    // },
    {
        num: 84,
        title: '@你，领钱了！现在注册立送4.5元～',
        desc: '戳这里，立刻加入',
    },
    {
        num: 85,
        title: '每天要做的不过是赚赚赚赚赚赚赚赚钱～',
        desc: '这有一个挣钱的路子，每天100元，了解下？',
    },
    // {
    //     num: 86,
    //     title: '这软件，能稍稍满足你的赚钱欲～',
    //     desc: '别怪兄弟不是人，只怪亿刻太迷人',
    // },
    // {
    //     num: 87,
    //     title: '一旦下载这个app，忍不住摸鱼一整天～',
    //     desc: '阅读，游戏，活动，预测都能赚钱，越会玩赚越多',
    // },
    {
        num: 88,
        title: '自从有了它，我吃早饭没花过一分钱～',
        desc: '下载亿刻，你的早餐亿刻承包了',
    },
    {
        num: 89,
        title: '“我想要一款闲暇时间赚钱的神器，你有吗？” “有！”',
        desc: '下载亿刻，阅读，游戏，活动，预测都能赚钱，每日还有福利送',
    },
    // {
    //     num: 90,
    //     title: '“赚个早餐钱需要多久？” “10秒”',
    //     desc: '下载亿刻就送4.5元，参与活动，每天奖金翻翻翻',
    // },
    {
        num: 91,
        title: '快来！亿刻发钱了～',
        desc: '我都已经提现了200元'
    },
    // {
    //     num: 92,
    //     title: '你想找的福利，这个软件都有～',
    //     desc: '躺着都能赚钱，快来下载'
    // },
    // {
    //     num: 93,
    //     title: '不要再问我钱都是在哪挣的了！',
    //     desc: '玩亿刻，现在下载随机送4-100元现金'
    // },
    // {
    //     num: 94,
    //     title: '为什么一听钱，你们就把持不住？',
    //     desc: '那么现在有个送钱的软件，点击下载，随机送4-200元现金'
    // },
    {
        num: 95,
        title: '我工资少，但是每月都有额外几千零花钱～',
        desc: '点进来就告诉你为什么'
    },
    {
        num: 96,
        title: 'Ta用这个软件每个月额外赚上千元，工作一点不耽误～',
        desc: '赚钱就是王道，点击下载，你也可以'
    },
    // {
    //     num: 97,
    //     title: '快双12了，钱都备好了吗？',
    //     desc: '要不要亿刻帮你清空购物车？'
    // },
    {
        num: 98,
        title: '想要每月多点收入，或许就差它了～',
        desc: '下载亿刻随机送4-200元赏金，每天玩，每天送'
    },
    // {
    //     num: 99,
    //     title: '玩亿刻有人找乐子，有人找钱赚～',
    //     desc: '娱乐挣钱两不误，下载体验还送钱'
    // },
    // {
    //     num: 100,
    //     title: '推荐一个用手机软件赚钱的技巧～',
    //     desc: '下载亿刻，就送钱，老人小孩都会玩'
    // },
    // {
    //     num: 101,
    //     title: '这款赚钱软件有十八般武艺，来切磋一下？',
    //     desc: '各种赚钱活动，应接不暇，快来'
    // },

    // 102 到 111 为 10玩2活动
    // {
    //     num: 102,
    //     title: '你的身价又涨了！',
    //     desc: '年底加薪啦！10万元年终奖金，快来下载亿刻app>>>',
    // },

    {
        num: 103,
        title: '介绍你一个吸金软件！',
        desc: '邀一名好友得8-10元！以前半个月挣得钱，现在一天挣够，高额奖励速来了解！',
    },

    {
        num: 104,
        title: '未读新消息',
        desc: '内含福利，请查收>>>',
    },

    // {
    //     num: 105,
    //     title: '在吗？',
    //     desc: '帮你申请了10w奖金！剩下就看你啦，点此轻松致富>>>',
    // },


    {
        num: 106,
        title: '来领福利！',
        desc: '速来领取，8-10元赏金，邀请好友一起玩转亿刻！',
    },

    // {
    //     num: 107,
    //     title: '【福利提示】',
    //     desc: '10万元年终奖金发放中，邀请一个好友即赚50元，亿刻年底分红，巨额福利速来领>>>',
    // },

    {
        num: 108,
        title: '用力点！',
        desc: '来亿刻一次赚够全年收入，2019，你爱行不行，我一路躺赢！',
    },

    {
        num: 109,
        title: '赚钱秘籍分享',
        desc: '见者有份，点我发财！奖励金一次到账！速来>>>',
    },

    {
        num: 110,
        title: '组团来玩啊！',
        desc: '赚多少提多少，每天都能提现到账！爽翻了！超级靠谱的软件~',
    },

    // {
    //     num: 111,
    //     title: '亿刻发钱啦！什么都没干就玩这个最赚~',
    //     desc: '10w奖金一次到位，年底吐血发钱！快跟我一起下载赚钱啦~',
    // },

    {
        num: 112,
        title: '无本万利的野路子，快来捞一笔！',
        desc: '亿刻限时发钱链接，点此有效，速进！',
    },
    {
        num: 113,
        title: '超值活动！限时秒',
        desc: '邀一名好友得8-10元！全网最高奖励额！全年拿分红，邀请当日立即领7元！',
    },
    {
        num: 114,
        title: '8-10元赏金，任务简单，go→',
        desc: '0元投资，1个手机即可完成任务领金币>>>',
    },
    // {
    //     num: 115,
    //     title: '【提现通知】10000+人已提100元！',
    //     desc: '帮你申请了10w奖金！人人有份，更有多项日常赚金币任务，跟好友一起玩转亿刻！',
    // },
    {
        num: 116,
        title: '打开这条链接，揭晓“收徒大拿”月入过万的秘诀>>>',
        desc: '点我秒赚！',
    },
    // {
    //     num: 117,
    //     title: '总结一下最近的朋友圈热门~',
    //     desc: '目前最火的活动！亿刻年底分红，10万元年终奖金发放中，巨额福利速来领>>>',
    // },
    {
        num: 118,
        title: '这是一个零花钱的提款机',
        desc: '多年行业推荐，百万用户信赖，靠谱！',
    },
    {
        num: 119,
        title: '推荐这个软件，每天提现100元~',
        desc: '做任务，邀请好友，分享文章，都能赚金币，懂的来>>>',
    },
    {
        num: 120,
        title: '注册就领5.5元！我试过了！',
        desc: '靠谱平台，推荐给你，我已经提了100元了，秒到账的！',
    },
    {
        num: 121,
        title: '今天的热门软件，朋友圈里都在用！',
        desc: '阅读就可以赚钱的app，可提现到账，亲测有效~',
    },

    {
        num: 122,
        title: '10亿金币大放送，新春豪礼享不停！',
        desc: '想知道你猪年的财运如何吗？邀请好友试一试>>>',
    },

    {
        num: 123,
        title: '嘘！悄悄告诉你存钱猪活动开始啦！',
        desc: '邀请好友随机获金币，赢取新年的第一桶金>>>',
    },

    {
        num: 124,
        title: '惊呆了！10亿金币竟然白送！',
        desc: '老司机们已经上车了，你还在等什么，点击上车>>>',
    },
    {
        num: 125,
        title: '告诉你个秘密，存钱猪里竟然藏着10亿金币！',
        desc: '来不及解释了，懂的人早就已经发财了>>>',
    },

    {
        num: 126,
        title: '邀请好友得赏金，轻松赚取零花钱',
        desc: '邀一名好友得8-10元，动动手指就赚钱，详情可见>>>',
    },

    {
        num: 127,
        title: '来不及解释了，猪年最新赚钱秘籍',
        desc: '你没有听错，邀请好友就能赚钱，你还在犹豫什么>>>',
    },

    {
        num: 128,
        title: '我决定悄悄跟你分享这个躺着赚钱的秘密',
        desc: '邀请好友可得8-10元现金奖励，邀请越多，奖励越多>>>',
    },

    {
        num: 129,
        title: '邀好友，得现金，新人注册享豪礼',
        desc: '悄悄地告诉你一个赚钱的秘密，每邀请一名好友立得8-10元奖励>>>',
    },

    {
        num: 130,
        title: '有个大额项目想跟你合作一下！',
        desc: '邀请一名好友即可获得8-10元，今年的压岁钱都在这了！',
    },

];
