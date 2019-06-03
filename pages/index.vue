<template>
    <div class="download">
        <div v-if="fixed" class="fixed">
            <img src="~assets/img/logo.png" />
            <div class="slogan">
                <h2>亿  刻</h2>
                <p>时间就是金钱</p>
            </div>
            <button class="download-btn" @click="download">立即下载</button>
        </div>

        <div v-if="guide" class="guide">
            <div class="mask" @click="hideGuide"></div>
            <div class="arrow"></div>
            <div class="text">
                <h4>请使用<em>浏览器</em>打开<br/>立即下载<em>亿刻APP</em></h4>
                <p>说明：</p>
                <p>1、点击右上角更多按钮；</p>
                <p>2、在弹出窗口中选择用浏览器打开，即可下载App。</p>
                </p>
            </div>
        </div>

        <div ref="head" class="head">
            <div class="btn download-btn" @click="download">立即下载</div>
        </div>

        <div class="body">
            <img src="~assets/img/landpage/5.png" />

            <!-- <img src="~assets/img/landpage/2.png" />
            <img src="~assets/img/landpage/3.png" />
            <img src="~assets/img/landpage/4.png" /> -->
        </div>

        <alert v-if="showAlert"
            v-on:ok="hideAlert"
            >{{alert}}</alert>
    </div>
</template>

<script>
import Alert from '~/components/Alert';
import sdk from '~/plugins/wechatsdk';
import {http, qs} from '~/plugins/axios';
import clipboard from '~/plugins/clipboard';
import {apiBaseUrl, localUrl, appstore, chan1009,} from '~/config';

export default {
    name: 'download',
    components: {
        Alert,
    },
    head() {
        return {
            title: '亿刻官网_最新最快亿刻今日资讯头条新闻亿刻阅读平台,亿刻全新热门趣味益智类app',
            meta: [
                {
                    hid: 'keywords',
                    name: 'keywords',
                    content: '亿刻官网,亿刻APP,亿刻,头条,阅读,讯息,生活方式',
                },
                {
                    hid: 'description',
                    name: 'description',
                    content: '亿刻是个人价值的记录工具,亿刻为用户提供邀请好友预测猜球阅读奖励的分享参与模式,世界杯期间赞助梁宏达评论节目老梁说世界杯',
                },
            ],
        }
    },
    data() {
        return {
            fixed: false,
            guide: false,
            showAlert: false,
            alert: '',
        };
    },
    asyncData({query, req, redirect}) {
        if (process.client) {
            return;
        }

        const ua = req.headers['user-agent'];
        // 跳转 电脑 版本
        if (!ua.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
            return redirect('http://www.pezy.cn/download', query);
        }
    },
    methods: {
        setScroll() {
            const _this = this;
            const head = this.$refs.head.offsetHeight;
            window.addEventListener('scroll', ()=>{
                const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

                if (scrollTop > head) {
                    _this.fixed = true;
                } else {
                    _this.fixed = false;
                }
            }, false);
        },

        setWechat() {
            const ua = navigator.userAgent;

            if (ua.match(/MicroMessenger/i)) {
                this.guide = true;
            }
        },

        download() {
            // TDAPP.onEvent('h5_index_download');
            const ua = navigator.userAgent;

            if (ua.match(/MicroMessenger/i)) {
                location.href = chan1009.yyb;

            } else if (ua.match(/iPhone|iPad|iPod/i)) {
                location.href = appstore;

            } else {
                location.href = this.getJumpUrl();
            }
        },

        hideGuide() {
            this.guide = false;
        },

        hideAlert() {
            this.showAlert = false;
        },

        setsdk() {
            const wx = sdk.init();
            const _this = this;

            http.post(`${apiBaseUrl}/wx/getJsSdk`, qs.stringify({
                url: location.href,
            }))
            .then((res)=>{
                if (res.data.code != 1000) {
                    // _this.$toast('微信分享暂不能使用');
                }

                wx.config({
                    debug: false,
                    appId: res.data.appId,
                    timestamp: res.data.timestamp,
                    nonceStr: res.data.nonceStr,
                    signature: res.data.signature,
                    jsApiList: ['onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone', 'onMenuShareTimeline', 'onMenuShareWeibo'],
                });

                wx.ready(()=>{
                    const sharedata = {
                        title: '亿刻APP 时间就是金钱',
                        desc: '好友们都开始转战亿刻APP，你也别out啦!',
                        imgUrl: `${localUrl}/images/logo.png`,
                        link: `${localUrl}/landpage`,
                    };

                    wx.onMenuShareAppMessage(sharedata);

                    wx.onMenuShareTimeline(sharedata);

                    wx.onMenuShareQZone(sharedata);

                    wx.onMenuShareQQ(sharedata);
                });
            })
            .catch((error)=>{
                // _this.$toast('获取JS-SDK失败');
            });
        },

        getJumpUrl() {
            let url = 'http://www.pezy.cn/jump';

            if (this.$route.query.channel) {
                return `${url}?channel=${this.$route.query.channel}`;
            }

            return url;
        },

        autoDownload() {
            const ua = navigator.userAgent;
            const isWechat = ua.match(/MicroMessenger\/[0-9]/i);
            const isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1;
            let url = `http://www.pezy.cn/jump`;

            if (isAndroid && !isWechat) {
                setTimeout(() => {
                    if (this.$route.query.channel) {
                        location.replace(`${url}?channel=${this.$route.query.channel}`);
                    } else {
                        location.replace(url);
                    }

                }, 300);
            }
        },
    },
    mounted() {
        // TDAPP.onEvent('h5_index_pv');
        this.setsdk();
        this.setScroll();
        // this.setWechat();
        this.autoDownload();
    },
}
</script>

<style scoped lang="less">
@import '~assets/less/Mixins.less';

.download {
    user-select: text;
}


.fixed {
    // display: none;
    position: fixed;
    top: .24rem;
    left: .24rem;
    height: 1.36rem;
    width: 7rem;
    background: #fff;
    box-shadow: 0 .1rem .2rem 0 rgba(36, 95, 178, 0.30);
    border-radius: .24rem;
    display: flex;
    align-items: center;
    padding: .28rem .32rem;
    z-index: 1000;

    img {
        width: .8rem;
        height: .8rem;
        border-radius: .1rem;
        box-shadow: 0 0 .24rem 0 rgba(174,46,19,0.57);
        margin-right: .32rem;
    }

    button {
        .linear-color-orange();
        box-shadow: 0 0 .24rem 0 rgba(174,46,19,0.57);
        font-size: .32rem;
        color: #fff;
        height: .72rem;
        padding: .14rem .32rem;
        border: 0;
        border-radius: .72rem;
    }

    .slogan {
        flex: 1;

        h2 {
            margin-top: 0;
            margin-bottom: .1rem;
            font-size: .3rem;
            color: #383B3D;
            letter-spacing: .05rem;
            line-height: .42rem;
        }

        p {
            font-size: .24rem;
            color: #B6BBBF;
            line-height: .34rem;
        }
    }
}

.guide {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1001;

    .mask {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .6);
    }

    .arrow {
        position: fixed;
        right: .1rem;
        top: .1rem;
        width: 1.2rem;
        height: 1.4rem;
        background: url('~assets/img/landpage/arrow.png') no-repeat center;
        background-size: 100%;
    }

    .text {
        position: fixed;
        top: 1.2rem;
        left: 50%;
        width: 5rem;
        background: rgba(0, 0, 0, .7);
        border-radius: .28rem;
        padding: .4rem;
        transform: translateX(-50%);

        p {
            line-height: .44rem;
            font-size: .32rem;
            color: #fff;
            margin-bottom: .18rem;
        }

        h4 {
            margin: 0;
            line-height: .6rem;
            font-size: .44rem;
            color: #fff;
            text-align: center;
            margin-bottom: .4rem;
        }

        em {
            color: #E39A3F;
            font-style: normal;
        }

    }
}

.head {
    height: 5.4rem;
    background: url('~assets/img/landpage/banner.png') no-repeat;
    background-size: 100%;
    margin-bottom: .76rem;
    padding-top: 3.64rem;

    .btn {
        box-shadow: 0 0 .24rem 0 rgba(174,46,19,0.57);
        border-radius: .82rem;
        height: .82rem;
        font-size: .44rem;
        line-height: .82rem;
        color: #FF6F4D;
        letter-spacing: 3.7px;
        text-align: center;
        background: #fff;
        width: 5rem;
        margin: 0 auto;
    }
}

.body {
    img {
        display: block;
        width: 100%;
        margin-bottom: 1.2rem;

        &:last-of-type {
            margin: 0;
        }
    }
}
</style>
