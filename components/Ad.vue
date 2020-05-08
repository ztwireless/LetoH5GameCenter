<template>
    <div class="alert" @touchmove.prevent>
        <div class="mask" @touchmove.prevent></div>
        <div class="body">
            <div class="main">
                <div class="cover">
                    <img @click="openGame" class="cover-img" :src="img_url"  >
                    <img @click="close" class="close"  src="~assets/img/hybrid/ad/close.png"  >
                </div>
                <div class="ad">
<!--                    <div class="ad-bg">-->

<!--                    </div>-->
                    <div class=""  ref="feedAd" style="background-color:12B1EC ">
<!--                        <img src="~assets/img/hybrid/common/tjzm.png" alt="">-->
                    </div>
                </div>
                <slot />
            </div>
<!--            <div class="tools">-->
<!--                <div class="install" @click="ok">{{btn}}</div>-->
<!--            </div>-->
        </div>
    </div>
</template>

<script>
export default {
    name: 'Ad',
    props: {
        img_url: {
            type: String,
            default: require( 'assets/img/hybrid/ad/900.png')
        },
        game_url:{
            type: String,
            default: 'http://download.mgc-games.com/games/games/1000054/__start__.html'
        },
        btn: {
            type: String,
            default: '安装'
        },
    },
    mounted(){

        //初始化信息流
        this.createFeedAd()

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
        },

        //创建信息流广告
        createFeedAd(){
             var dom=this.$refs.feedAd
            var ad = mgc.createFeedAd({
                container:dom
            })

            ad.onLoad(()=> {
               alert('信息流加载成功')
                ad.show()
            })

            ad.onError(()=>{
                alert('信息流加载失败')
            })
            ad.load()
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
}

.main {
    position: relative;
    display: block;
    width: 100%;

    .cover{
        position: relative;
        display: block;
        text-align: center;
        width:4.38rem;
        margin: 0 auto;
        margin-top: 1rem;

        .cover-img{
            display: inline-block;
            width:100%;
        }

        .close{
            position: absolute;
            right: 0;
            top: 0;
            width:0.49rem;
            height:0.49rem;
        }
    }

    .ad{
        width:6.74rem;
        min-height:3.81rem;
        position: relative;
        margin-top: 0.35rem;
        /*background-image:  linear-gradient(30deg,#FAD961,#64FA53,#48D7DC,#474CFF,#D500FF,#FF0000);*/
        border-radius:0.25rem;
        overflow: hidden;
        padding: 0.07rem;
        margin: auto;
        box-sizing: content-box;

        .ad-bg{
            width:7.94rem;
            height: 7.94rem;
            background-image:  linear-gradient(30deg,#FAD961,#64FA53,#48D7DC,#474CFF,#D500FF,#FF0000);
            position: absolute;
            top: -2rem;
            left: -0.5rem;
            animation: myfirst 4s linear;
            animation-iteration-count: infinite;
            @keyframes myfirst
            {
                from { transform:rotate(0deg);}
                to { transform:rotate(360deg);}
            }
        }

        .ad-content{
             display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            margin: auto;
            width: 98%;
            height: 97%;
            border-radius:0.18rem;
            left: 1%;
            top:1.5%;
            z-index: 999;
            background-color: #12B1EC;
            img{
                height: 100%;
            }
        }
    }

}

.tools {

    .install {
        width:4.44rem;
        height:0.76rem;
        line-height: 0.76rem;
        background-color:rgba(247,122,48,1);
        border-radius:0.38rem;
        margin: auto ;
        margin-top: 0.69rem;
        font-size:0.33rem;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(255,255,255,1);
        text-align: center;
    }
}
</style>
