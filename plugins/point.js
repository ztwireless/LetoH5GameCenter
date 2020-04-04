// uuid = Math.random().toString(36).substring(3, 8)

import {http, qs} from './axios';
import uaParse from './ua-parse';
import native from './native';
import fingerprint from './fingerprint';
import {DEVICEID} from './key';

/**
 * 客户端内 PAGE 埋点
 * @param {} type
 */
export function hybridPointPage(options) {
    const device = native.getDeviceInfo();
    const userInfo = native.getUserInfo();

    let point = {
        ts: new Date().valueOf(),
        verCode: '1.0.0',
        devVendor: 'h5',
        type: 'hybrid_pv',
        screen: `${window.screen.width}x${window.screen.height}`,
        os: device.getOs(),
        //osVersion: device.os.version.info,
        ua: navigator.userAgent,
        url: encodeURIComponent(location.href),
        mac: ``,
        net: ``,
        netVendor: ``,
        chanId: device.getPublishid(),
        lon: ``,
        lat: ``,
        imei: ``,
        deviceId: device.getDeviceId(),
        guid: userInfo.getGuid(),
    };

    point = Object.assign(point, options);

    http.post('http://d.pezy.cn/data/report/h5', qs.stringify(point))
    .catch((error)=>{
        console.log(error);
    });
}


/**
 *
 * @param {*} type
 */
export function hybridPointAction(options) {
    const device = native.getDeviceInfo();
    const userInfo = native.getUserInfo();

    let point = {
        ts: new Date().valueOf(),
        verCode: '1.0.0',
        devVendor: 'h5',
        type: 'hybrid_action',
        screen: `${window.screen.width}x${window.screen.height}`,
        os: device.getOs(),
        ua: navigator.userAgent,
        url: encodeURIComponent(location.href),
        mac: ``,
        net: ``,
        netVendor: ``,
        chanId: device.getPublishid(),
        lon: ``,
        lat: ``,
        imei: ``,
        deviceId: device.getDeviceId(),
        guid: userInfo.getGuid(),
    };

    point = Object.assign(point, options);

    http.post('http://d.pezy.cn/data/report/h5', qs.stringify(point))
    .catch((error) => {
        console.log(error);
    });
}

/**
 * H5 端外埋点
 * @param {*} options
 * type: h5article
 * blackbox: 同盾 id
 */
export function h5point(options) {
    const device = uaParse(navigator.userAgent);

    let app;
    let appVersion;

    if (device.app.isApp) {
        app = device.app.name;
        appVersion = device.app.version.info;
    } else {
        app = device.browser.name;
        appVersion = device.browser.version.info;
    }

    let point = {
        ts: new Date().valueOf(),
        verCode: '1.0.0',
        devVendor: 'h5',

        type: 'h5article',
        app,
        appVersion,

        mac: ``,
        screen: `${window.screen.width}x${window.screen.height}`,
        net: ``,
        netVendor: ``,
        os: device.os.name,
        osVersion: device.os.version.info,
        chanId: ``,
        lon: ``,
        lat: ``,
        imei: ``,
        guid: ``,

        url: encodeURIComponent(location.href),
    };

    point = Object.assign(point, options);

    http.post('http://d.pezy.cn/data/report', qs.stringify(point))
    .catch((error)=>{
        console.log(error);
    });
}


/**
 * H5 端外埋点
 * @param {*} options
 * type: h5article
 * blackbox: 同盾 id
 */
export function h5PointAction(options) {
    const ua = navigator.userAgent;
    const device = uaParse(ua);
    const deviceId = setFingerprint();

    let app;
    let appVersion;

    if (device.app.isApp) {
        app = device.app.name;
        appVersion = device.app.version.info;
    } else {
        app = device.browser.name;
        appVersion = device.browser.version.info;
    }

    let point = {
        ts: new Date().valueOf(),
        verCode: '1.0.0',
        devVendor: 'h5',
        type: 'h5_action',
        app,
        appVersion,
        screen: `${window.screen.width}x${window.screen.height}`,
        os: device.os.name,
        osVersion: device.os.version.info,
        ua: ua,
        url: encodeURIComponent(location.href),
        deviceId: deviceId,

        // mac: ``,
        // netVendor: ``,
        // net: ``,
        // chanId: ``,
        // lon: ``,
        // lat: ``,
        // imei: ``,
        // guid: ``,

    };

    point = Object.assign(point, options);

    http.post('http://d.pezy.cn/data/report/h5', qs.stringify(point))
    .catch((error)=>{
        console.log(error);
    });
}


// 屏幕指纹
function setFingerprint(callback) {
    const deviceId = localStorage.getItem(DEVICEID);

    if (deviceId) {
        callback && callback(deviceId);
        return deviceId;
    }

    new fingerprint().get(function(result, components) {
        localStorage.setItem(DEVICEID, result);
        callback && callback(result);
    });
}


/**
 * H5 端外埋点
 * @param {*} options
 * type: h5article
 * blackbox: 同盾 id
 */
export function h5PointPage(options) {
    const ua = navigator.userAgent;
    const device = uaParse(ua);

    let app;
    let appVersion;

    if (device.app.isApp) {
        app = device.app.name;
        appVersion = device.app.version.info;
    } else {
        app = device.browser.name;
        appVersion = device.browser.version.info;
    }

    let point = {
        ts: new Date().valueOf(),
        verCode: '1.0.0',
        devVendor: 'h5',
        type: 'h5_pv',
        app,
        appVersion,
        screen: `${window.screen.width}x${window.screen.height}`,
        os: device.os.name,
        osVersion: device.os.version.info,
        ua: ua,
        url: encodeURIComponent(location.href),
    };

    setFingerprint((deviceId) => {
        point = Object.assign(point, {deviceId: deviceId}, options);

        http.post('http://d.pezy.cn/data/report/h5', qs.stringify(point))
        .catch((error)=>{
            console.log(error);
        });
    });
}


/**
 * H5 广告 端外埋点
 * @param {*} options
 * type: h5article
 * blackbox: 同盾 id
 */
export function h5AdExposure(options) {
    const ua = navigator.userAgent;
    const device = uaParse(ua);

    let app;
    let appVersion;

    if (device.app.isApp) {
        app = device.app.name;
        appVersion = device.app.version.info;
    } else {
        app = device.browser.name;
        appVersion = device.browser.version.info;
    }

    let point = {
        ts: new Date().valueOf(),
        verCode: '1.0.0',
        devVendor: 'h5',
        type: 'h5_ad',
        adType: 0, // 0-曝光, // 1-点击 // 2-关闭
        app,
        appVersion,
        screen: `${window.screen.width}x${window.screen.height}`,
        os: device.os.name,
        osVersion: device.os.version.info,
        ua: ua,
        url: encodeURIComponent(location.href),
    };

    setFingerprint((deviceId) => {
        point = Object.assign(point, {deviceId: deviceId}, options);

        http.post('http://d.pezy.cn/data/report/h5', qs.stringify(point))
        .catch((error)=>{
            console.log(error);
        });
    });
}

/**
 * H5 广告 端外埋点
 * @param {*} options
 * type: h5article
 * blackbox: 同盾 id
 */
export function h5AdAction(options) {
    const ua = navigator.userAgent;
    const device = uaParse(ua);
    const deviceId = setFingerprint();

    let app;
    let appVersion;

    if (device.app.isApp) {
        app = device.app.name;
        appVersion = device.app.version.info;
    } else {
        app = device.browser.name;
        appVersion = device.browser.version.info;
    }

    let point = {
        ts: new Date().valueOf(),
        verCode: '1.0.0',
        devVendor: 'h5',
        type: 'h5_ad',
        adType: 1, // 0-曝光, // 1-点击 // 2-关闭
        app,
        appVersion,
        screen: `${window.screen.width}x${window.screen.height}`,
        os: device.os.name,
        osVersion: device.os.version.info,
        ua: ua,
        url: encodeURIComponent(location.href),
        deviceId: deviceId,
    };

    point = Object.assign(point, options);

    http.post('http://d.pezy.cn/data/report/h5', qs.stringify(point))
    .catch((error)=>{
        console.log(error);
    });
}

/**
 * H5 广告 端外埋点
 * @param {*} options
 * type: h5article
 * blackbox: 同盾 id
 */
export function h5AdClose(options) {
    const ua = navigator.userAgent;
    const device = uaParse(ua);
    const deviceId = setFingerprint();

    let app;
    let appVersion;

    if (device.app.isApp) {
        app = device.app.name;
        appVersion = device.app.version.info;
    } else {
        app = device.browser.name;
        appVersion = device.browser.version.info;
    }

    let point = {
        ts: new Date().valueOf(),
        verCode: '1.0.0',
        devVendor: 'h5',
        type: 'h5_ad',
        adType: 2, // 0-曝光, // 1-点击 // 2-关闭
        app,
        appVersion,
        screen: `${window.screen.width}x${window.screen.height}`,
        os: device.os.name,
        osVersion: device.os.version.info,
        ua: ua,
        url: encodeURIComponent(location.href),
        deviceId: deviceId,
    };

    point = Object.assign(point, options);

    http.post('http://d.pezy.cn/data/report/h5', qs.stringify(point))
    .catch((error)=>{
        console.log(error);
    });
}


/**
 * 客户端内 PAGE 埋点
 * @param {} type
 */
export function hybridAdExposure(options) {
    const device = native.getDeviceInfo();
    const userInfo = native.getUserInfo();

    let point = {
        ts: new Date().valueOf(),
        verCode: '1.0.0',
        devVendor: 'h5',
        type: 'hybrid_ad',
        adType: 0, // 0-曝光, // 1-点击  // 2-关闭
        screen: `${window.screen.width}x${window.screen.height}`,
        os: device.getOs(),
        //osVersion: device.os.version.info,
        ua: navigator.userAgent,
        url: encodeURIComponent(location.href),
        mac: ``,
        net: ``,
        netVendor: ``,
        chanId: device.getPublishid(),
        lon: ``,
        lat: ``,
        imei: ``,
        deviceId: device.getDeviceId(),
        guid: userInfo.getGuid(),
    };

    point = Object.assign(point, options);

    http.post('http://d.pezy.cn/data/report/h5', qs.stringify(point))
    .catch((error)=>{
        console.log(error);
    });
}


/**
 *
 * @param {*} type
 */
export function hybridAdAction(options) {
    const device = native.getDeviceInfo();
    const userInfo = native.getUserInfo();

    let point = {
        ts: new Date().valueOf(),
        verCode: '1.0.0',
        devVendor: 'h5',
        type: 'hybrid_ad',
        adType: 1, // 0-曝光, // 1-点击  // 2-关闭
        screen: `${window.screen.width}x${window.screen.height}`,
        os: device.getOs(),
        ua: navigator.userAgent,
        url: encodeURIComponent(location.href),
        mac: ``,
        net: ``,
        netVendor: ``,
        chanId: device.getPublishid(),
        lon: ``,
        lat: ``,
        imei: ``,
        deviceId: device.getDeviceId(),
        guid: userInfo.getGuid(),
    };

    point = Object.assign(point, options);

    http.post('http://d.pezy.cn/data/report/h5', qs.stringify(point))
    .catch((error) => {
        console.log(error);
    });
}


/**
 *
 * @param {*} type
 */
export function hybridAdClose(options) {
    const device = native.getDeviceInfo();
    const userInfo = native.getUserInfo();

    let point = {
        ts: new Date().valueOf(),
        verCode: '1.0.0',
        devVendor: 'h5',
        type: 'hybrid_ad',
        adType: 2, // 0-曝光, // 1-点击  // 2-关闭
        screen: `${window.screen.width}x${window.screen.height}`,
        os: device.getOs(),
        ua: navigator.userAgent,
        url: encodeURIComponent(location.href),
        mac: ``,
        net: ``,
        netVendor: ``,
        chanId: device.getPublishid(),
        lon: ``,
        lat: ``,
        imei: ``,
        deviceId: device.getDeviceId(),
        guid: userInfo.getGuid(),
    };

    point = Object.assign(point, options);

    http.post('http://d.pezy.cn/data/report/h5', qs.stringify(point))
    .catch((error) => {
        console.log(error);
    });
}
