<template>
    <div class="share">
        <div class="mask" @click="cancel"></div>
        <div class="body">
            <div class="main">
                <h6>分享</h6>

                <div class="tools">
                    <div class="timeline" @click="timeline">
                        朋友圈
                    </div>
                    <div class="wechat" @click="wechat">
                        微信好友
                    </div>
                    <div class="qq" v-if="isQQ" @click="qq">
                        QQ
                    </div>
                </div>
                <div class="cancel" @click="cancel">取消</div>
            </div>
        </div>
    </div>
</template>

<script>
import native from '~/plugins/native';
import {localUrl} from '~/config';

export default {
    name: 'share',
    props: {
        sharedata: {
            type: Object,
            // 对象或数组且一定会从一个工厂函数返回默认值
            default: function () {
                // 默认数据
                return {
                    url: localUrl,
                    title: '亿刻APP - 时间就是金钱',
                    desc: '时间就是金钱',
                    thumbUrl: `${localUrl}/images/logo.png`,
                };
            }
        },
    },
    data() {
        return {
            isQQ: false,
        }
    },
    mounted() {
        let version = this.$route.query.appVersion || '';
        let isIos = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        version = version.replace(/\./ig, '');

        if (!isIos && version >= 140) {
            this.isQQ = true;
        }
    },
    methods: {
        timeline() {
            // this.$emit('ok');
            // console.log(this.sharedata);
            const timeline = Object.assign({
                type: 1,
            }, this.sharedata);

            native.wxshare(timeline);
        },
        wechat() {
            const wechat = Object.assign({
                type: 0,
            }, this.sharedata);

            native.wxshare(wechat);
        },
        qq() {
            const wechat = Object.assign({
                type: 4,
            }, this.sharedata);

            native.wxshare(wechat);
        },
        cancel() {
            this.$emit('cancel');
        }
    }
}
</script>

<style scoped lang="less">
@import '~assets/less/Mixins.less';

.share {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1200;
}

.mask {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, .3);
}

.body {
    position: absolute;
    border-top-left-radius: .24rem;
    border-top-right-radius: .24rem;
    background: #fff;
    bottom: 0;
    left: 0;
    z-index: 1;
    width: 100%;
}

.main {
    position: relative;
    padding-top: .48rem;

    h6 {
        text-align: center;
        font-size: .32rem;
        line-height: .44rem;
        color: #383B3D;
        font-weight: normal;
        margin-bottom: .48rem;
        margin-top: 0;
    }
}

.tools {
    display: flex;
    justify-content: space-around;
    padding: 0 .5rem .48rem .5rem;
}

.timeline {
    text-align: center;
    color: #383B3D;
    line-height: .28rem;
    font-size: .28rem;

    &:before {
        content: '';
        width: .96rem;
        height: .97rem;
        background: url('~assets/img/hybird/common/share-timeline.png') no-repeat;
        background-size: 100%;
        display: block;
        margin: 0 auto .24rem auto;
    }
}

.wechat {
    text-align: center;
    color: #383B3D;
    line-height: .28rem;
    font-size: .28rem;

    &:before {
        content: '';
        width: .96rem;
        height: .97rem;
        background: url('~assets/img/hybird/common/share-wechat.png') no-repeat;
        background-size: 100%;
        display: block;
        margin: 0 auto .24rem auto;
    }
}


.qq {
    text-align: center;
    color: #383B3D;
    line-height: .28rem;
    font-size: .28rem;

    &:before {
        content: '';
        width: .96rem;
        height: .97rem;
        background: url('~assets/img/hybird/common/share-qq.png') no-repeat;
        background-size: 100%;
        display: block;
        margin: 0 auto .24rem auto;
    }
}


.cancel {
    .border-top-1px(#F2F6F7);
    font-size: .32rem;
    height: 1.2rem;
    line-height: 1.2rem;
    text-align: center;
    color: #383B3D;
}
</style>
