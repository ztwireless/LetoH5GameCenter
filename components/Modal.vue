<template>
    <div class="alert" >
        <div class="mask"></div>
        <div class="body">
            <div class="main">
                <img src="~assets/img/hybrid/common/tips-top.png"   class="top-img">
                <img @click="close" class="close"  src="~assets/img/hybrid/common/cha.png"  >
                <div class="title">
                    {{title}}
                </div>
                <div class="content">
                    {{content}}
                </div>

                <slot />
                <div class="tools">
                    <div class="ok" @click="ok">{{btn}}</div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    export default {
        name: 'Modal',
        props: {
            title: {
                type: String,
                default: "温馨提醒"
            },

            content:{
                type: String,
                default: ""
            },

            btn: {
                type: String,
                default: '确定'
            }
        },
        methods: {
            ok() {
                this.$emit('ok');
            },
            close(){
                this.$emit('close');
            },
            openGame(){
                console.log('openGame');
                this.$emit('openGame');
                window.location.href='http://download.mgc-games.com/games/games/1000054/__start__.html'
            }
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
    }

    .body {
        position: absolute;
        z-index: 1;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
    }

    .main {
        position: relative;
        display: block;
        width: 80vw;
        min-height:90vw;
        background:rgba(255,255,255,1);
        border-radius:0.25rem;
        margin: auto;

        .top-img{
            display: block;
        }

        .close{
            position: absolute;
            right: 0.21rem;
            top: 0.21rem;
            width:0.28rem;
            height:0.28rem;

        }

        .title{
            display: block;
            width:5.56rem;
            text-align: center;
            font-size:0.32rem;
            font-family:PingFangSC-Medium,PingFang SC;
            font-weight:500;
            color:rgba(51,51,51,1);
            margin:0.21rem auto;
        }
        .content{
            width:4.61rem;
            min-height:0.86rem;
            font-size:0.24rem;
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(102,102,102,1);
            line-height:0.43rem;
            margin: auto;
            margin-top: 0.21rem;
        }

    }

    .tools {

        .ok {
            width:3.47rem;
            height:0.76rem;
            background:rgba(61,154,240,1);
            border-radius:0.42rem;
            font-size:0.28rem;
            font-family:PingFangSC-Semibold,PingFang SC;
            font-weight:600;
            color:rgba(255,255,255,1);
            line-height:0.76rem;
            text-align: center;
            margin: 0.56rem auto;

        }
    }
</style>
