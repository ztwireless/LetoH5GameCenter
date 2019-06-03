// // 计算 REM
// function getFontSize() {
//     var clientWidth = document.documentElement.clientWidth,
//         fontSize = 10 * 10;

//     if (!clientWidth)
//         return;

//     if (clientWidth < 1080) {
//         fontSize = 100 * (clientWidth / 750);
//     } else {
//         fontSize = 100 * (1080 / 750);
//     }

//     return fontSize;
// }

// export function adaptSize() {
//     var doc = document;
//     var _root = doc.documentElement;
//     var resizeEvent = 'orientationchange' in window ?
//         'orientationchange' :
//         'resize';

//     var resizeCallback = function () {
//         _root.style.fontSize = getFontSize() + 'px';
//     };

//     if (!doc.addEventListener) {
//         return;
//     }

//     // var ua = navigator.userAgent;
//     // if (/Android/i.test(ua)) {
//     //     _root.className += ' android';
//     // }

//     // if (/(ip[honead]+)(?:.*os\s([\w]+)*\slike\smac|;\sopera)/i.test(ua)) {
//     //     _root.className += ' ios';
//     // }

//     window.addEventListener(resizeEvent, resizeCallback, false);
//     doc.addEventListener('DOMContentLoaded', resizeCallback, false);
// }

// // 计算 REM 后 PX 值
// export function rem2px(number) {
//     return Number((number * getFontSize() / 100).toFixed(3));
// }

// function px2rem(number) {
//     return Number((number / 100).toFixed(3));
// }

// adaptSize();

// console.log('test')

// http://www.ydui.org/flexible
export default function() {
    return `
    !function (win) {

        /* 设计图文档宽度 */
        var docWidth = 750;

        var doc = win.document,
            docEl = doc.documentElement,
            resizeEvt = 'orientationchange' in win ? 'orientationchange' : 'resize';

        var clientWidth = docEl.getBoundingClientRect().width;
        var recalc = (function refreshRem () {
            /* 8.55：小于320px不再缩小，11.2：大于420px不再放大 */
            docEl.style.fontSize = Math.max(Math.min(20 * (clientWidth / docWidth), 11.2), 8.55) * 5 + 'px';

            return refreshRem;
        })();

        /* 添加倍屏标识，安卓为1 */
        docEl.setAttribute('data-dpr', win.navigator.appVersion.match(/iphone/gi) ? win.devicePixelRatio : 1);

        if (/iP(hone|od|ad)/.test(win.navigator.userAgent)) {
            /* 添加IOS标识 */
            doc.documentElement.classList.add('ios');
            /* IOS8以上给html添加hairline样式，以便特殊处理
            if (parseInt(window.navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/)[1], 10) >= 8)
                doc.documentElement.classList.add('hairline');
                */
        }

        if (!doc.addEventListener) return;
        win.addEventListener(resizeEvt, recalc, false);
        doc.addEventListener('DOMContentLoaded', recalc, false);

        win.rem2px = function(num) {
            var root = Math.max(Math.min(20 * (clientWidth / docWidth), 11.2), 8.55) * 5;
            return Number((num * root).toFixed(3));
        };

        win.px2rem = function(num) {
            var root = Math.max(Math.min(20 * (clientWidth / docWidth), 11.2), 8.55) * 5;
            return Number((num / root).toFixed(3));
        };

    }(window);
    `
}
