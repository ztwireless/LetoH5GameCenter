<template>
    <div class="alert">
        <div class="mask"></div>
        <div class="body">
            <div class="main">
                <slot />
            </div>
            <div class="tools">
                <div class="ok" @click="ok">{{btn}}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'alert',
    props: {
        btn: {
            type: String,
            default: '确认'
        }
    },
    methods: {
        ok() {
            this.$emit('ok');
        },
    }
}
</script>

<style scoped lang="less">
@import '~assets/less/Mixins.less';

.alert {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1100;
}

.mask {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, .3);
    // box-shadow: 0 0 0 50vmax rgba(0, 0, 0, 0.3);
    // filter: blur(1rem);
    // filter: url(blur.svg#blur);
    // -webkit-filter: blur(10px);
}

.body {
    position: absolute;
    border-radius: .24rem;
    background: #fff;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
    width: 6.06rem;
}

.main {
    position: relative;
    padding: .72rem .4rem .48rem .4rem;
    text-align: center;

    font-size: .28rem;
    line-height: .4rem;
}

.tools {
    // display: flex;
    .border-top-1px(#F2F6F7);

    div {
        line-height: .44rem;
        font-size: .32rem;
        text-align: center;
        padding: .26rem 0;
    }

    .ok {
        color: #1EC783;
    }
}
</style>
