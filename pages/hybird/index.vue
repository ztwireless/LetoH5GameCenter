<template>
    <div class="rule">
        <header class="header">
            <div class="back" @click="back"></div>
            <h2>首页</h2>
        </header>

        <p>暂未开放</p>
    </div>
</template>

<script>
import native from '~/plugins/native';
export default {
    name: 'rule',

    components: {
    },
    head() {
        return {
            title: 'gold',
        }
    },
    data() {
        return {
            header: '我的金币',
        };
    },
    methods: {
        back() {
            native.closeWebview();
        }
    }
}
</script>

<style scoped lang="less">
@import '~assets/less/Mixins.less';

.rule {
    min-height: 100%;
    padding-top: .9rem;
    padding-bottom: .3rem;

    // .linear-color-orange();

    p {
        padding-top: 2rem;
        color: #383B3D;
        font-size: .3rem;
        text-align: center;
    }
}

.header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: .9rem;
    .linear-color-orange();

    h2 {
        font-size: .36rem;
        color: #fff;
        line-height: .9rem;
        margin: 0;
        text-align: center;
        font-weight: normal;
    }

    .back {
        width: .36rem;
        height: .36rem;
        background: url("~assets/img/hybird/common/back-white.png") no-repeat;
        background-size: 100%;
        position: absolute;
        top: .24rem;
        left: .24rem;
    }
}

</style>
