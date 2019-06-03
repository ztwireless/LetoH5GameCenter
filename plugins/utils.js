
/**
 * 分 换成 元
 * @param {} number
 * @param {*} fixed
 */
export function convertMoney(number, fixed) {
    if (typeof number != 'number') {
        number = parseInt(number);
    }

    number /= 100; // 转成 分

    // 保留小数点
    if (fixed) {
        number = number.toFixed(fixed);
    } else {
        number += '';
    }

    var reg = number.indexOf('.') > -1 ? /(\d{1,3})(?=(?:\d{3})+\.)/g : /(\d{1,3})(?=(?:\d{3})+$)/g; //千分符的正则

    number = number.replace(reg, '$1,');

    return number;
}

/**
 * 金币转换钱
 * @param {*} number
 * @param {*} fixed
 */
export function coinToMoney(number, fixed) {
    if (typeof number != 'number') {
        number = parseInt(number);
    }

    // TODO: 这有一点问题
    number /= 10000; // 转成 分

    // 保留小数点
    if (fixed) {
        number = number.toFixed(fixed);
    } else {
        number += '';
    }

    var reg = number.indexOf('.') > -1 ? /(\d{1,3})(?=(?:\d{3})+\.)/g : /(\d{1,3})(?=(?:\d{3})+$)/g; //千分符的正则

    number = number.replace(reg, '$1,');

    return number;
}

/**
 * 范围随机数
 * @param {*} Min
 * @param {*} Max
 */
export function randomNumBoth(Min, Max){
    var Range = Max - Min;
    var Rand = Math.random();
    var num = Min + Math.round(Rand * Range); //四舍五入
    return num;
}
/**
 * 替换手机号码为 134****2678
 */
export function replacePhoneNumber(phoneNumber) {
    let needReplace = phoneNumber.substring(3, 7);
    let replaceNumber = phoneNumber.replace(needReplace, "****");

    return replaceNumber;
}


export let headImg = [
    {
        url: '/images/headImg/100001.png'
    },
    {
        url: '/images/headImg/100002.png'
    },
    {
        url: '/images/headImg/100003.png'
    },
    {
        url: '/images/headImg/100004.png'
    },
    {
        url: '/images/headImg/100005.png'
    },
    {
        url: '/images/headImg/100006.png'
    },
    {
        url: '/images/headImg/100007.png'
    },
    {
        url: '/images/headImg/100008.png'
    }
]

export let reg = {
    // 手机号
    phone: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[35678]|18[0-9]|19[0-9]|14[57])[0-9]{8}$/,
}


/**
 * 增加 url 查询参数
 * @param {*} url
 * @param {*} object
 */
export function addUrlQuery(url, object) {
    let newUrl = url;
    if (/\?/.test(url)) {
        //newUrl +=
        for (let i in object) {
            newUrl += `&${i}=${object[i]}`;
        }

        return newUrl;
    }

    newUrl += '?';
    for (let i in object) {
        newUrl += `&${i}=${object[i]}`;
    }

    return newUrl;
}

/**
 * 修改 url 查询参数，对象 val = '',则删除
 * @param {string} url
 * @param {*} object
 */
export function replaceUrlQuery(url, object) {
    let newUrl = url;
    let oldObj = {};
    let uri = url.split('?');
    let path = uri[0];
    let search = uri[1];

    // ?
    if (search) {
        let array = search.split('&');

        for (let i = 0; i < array.length; i++) {
            let keyval = array[i].split('=');
            if (keyval[0]) {
                oldObj[keyval[0]] = keyval[1];
            }
        }
    }


    let query = Object.assign({}, oldObj, object);

    path += '?';
    for (let i in query) {
        if (query[i]) {
            path += `&${i}=${query[i]}`;
        }
    }

    return path;
}


/**
 * 下拉到页面底部加载更多
 */
// TODO: 加上 函数截流
export function isClient(callback) {
    let winH = window.innerHeight;
    let scrollH =  document.body.scrollHeight;
    let scrollTop = document.body.scrollTop ||
        document.documentElement.scrollTop ||
        window.pageYOffset;

    let scrollBottom = scrollH - scrollTop;
    // 50 是 偏移量
    if (scrollBottom >= winH && scrollBottom <= winH +50) {
        callback();
    }
}


/**
 * 随机分享域名
 */
export function randomShareUrl() {
    const domains = [
        // 'gushiqin.cn',
        // 'ggkew.cn',
        'meigegou.com.cn'
    ]

    const sup = Math.random().toString(36).substr(2, 6);
    const domain = domains[randomNumBoth(0, domains.length - 1)];

    return `http://${sup}.${domain}`

    // return `http://m.pezy.cn`;
    // return `http://${sup}.meigegou.com.cn`;
}

/**
 * 摇一摇
 *
*/
export let imgData = [
    "/images/lucky/money1.png",
    "/images/lucky/money3.png",
    "/images/lucky/money4.png",
    "/images/lucky/money4.png"
]

export let pigImg = [
    "/images/pig/gold.png",
    "/images/pig/pig-icon.png",
    "/images/pig/coin.png"

]




