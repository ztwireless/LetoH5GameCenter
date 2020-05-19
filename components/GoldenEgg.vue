<template>
    <div>
        <!--屏幕右下角的小蛋-->
        <div  class="small-egg" @click="showEgg">
            <img src="~assets/img/hybrid/egg/1/3.gif"  >
        </div>
        <!--显示中间的弹窗-->
        <div  v-show="this.showAlert"  class="alert" @touchmove.prevent>
            <img class="fade-egg" v-if="this.showEggFadeIn" src="~assets/img/hybrid/egg/1/22.gif" >
            <div  v-show="this.showBigEgg==true">
                <div  class="mask" @touchmove.prevent></div>
                <div  class="body">
                    <div class="main">
                        <div class="cover">

                            <!--金蛋-->
                            <img @click="smash" v-show="!this.showSmashEgg" class=" egg" src="~assets/img/hybrid/egg/1/2.gif">
                            <img  v-show="!this.showSmashEgg" class=" tips-line" src="~assets/img/hybrid/egg/1/white-line.png">
                            <div v-show="!this.showSmashEgg" class="tips">还有{{available_num}}机会</div>

                            <!--砸蛋的gif-->
                            <img v-if="this.showSmashEgg && this.showBigEgg==true" class=" egg" src="~assets/img/hybrid/egg/1/smash-egg2.gif">
                            <div v-if="this.showBtn"  class="jifen" >{{add_coins}}积分</div>
                            <img class="img-btn"  @click="receive" v-if="this.showBtn" src="~assets/img/hybrid/egg/1/btn.png" >

                            <img class="egg-bg" src="~assets/img/hybrid/egg/1/bg.png">

                        </div>
                        <div class="egg-text">砸金蛋领红包</div>
                        <div class="egg-text close" @click="close">放弃</div>
                        <div class="ad" v-show="!this.showFeedAdBg">
                            <div class="feedAd" ref="feedAd">
                            </div>
                        </div>

                        <div class="ad" v-show="this.showFeedAdBg"
                             style="display: block;width:6.59rem;background-color:#12B1EC;height: auto">
                            <img style="display: block;margin:auto;width: auto;height: 3rem;" class="ad"
                                 src="~assets/img/hybrid/common/tjzm.png" alt="">
                        </div>

                        <slot/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "GoldenEgg",
        props: {

            game_url: {
                type: String,
                default: 'http://download.mgc-games.com/games/games/1000054/__start__.html'
            },

            //还可以砸蛋的次数
            available_num: {
                type: Number,
                default: 0
            },

            add_coins:{
                type: Number,
                default: 0
            }


        },
        data() {
            return {
                showFeedAdBg: true,

                showAlert:false,
                showEggFadeIn:false,    //显示渐入的蛋
                showSmashEgg:false,     //显示砸蛋的gif
                showBtn:false,          //立即领取的按钮
                showBigEgg:false    //true显示弹窗，false显示右下角的标
            }
        },
        mounted() {
            //初始化信息流
           this.ad= this.createFeedAd(false)
        },
        methods: {
            close() {
                console.log('关闭砸蛋活动')
                this.$emit('close')
                this.showBigEgg=false
                this.showAlert=false
            },

            //显示金蛋
            showEgg(){
                console.log('显示砸金蛋的活动')

                if(this.available_num<=0){
                    this.$toast('今天的次数用完啦')
                    return
                }

                /*先显示蛋跳出来的动画*/
                this.showEggFadeIn=true
                this.showAlert=true
                setTimeout(()=>{
                    this.ad.show()      //显示信息流广告
                    this.showBigEgg=true
                    this.showEggFadeIn=false
                },1500)
            },

            //点击金蛋
            smash() {
                console.log('开始砸蛋');
                this.showSmashEgg=true
                //显示领取按钮
                setTimeout(()=>{
                    this.showBtn=true
                },1500)
                this.$emit('smash');
            },

            //领取金币红包
            receive(){
                console.log('点击了领取')
                this.$emit('receive');
                this.redisplayEgg()     //重新显示
            },

            //领取成功，再次展示金蛋的界面
            redisplayEgg(){
                console.log('显示砸金蛋的活动')
                this.showAlert=true
                this.showSmashEgg=false     //砸蛋退去
                this.showBtn=false           //领取按钮消失
                this.showBigEgg=true
            },

            //创建信息流广告
            createFeedAd(show) {
                var dom = this.$refs.feedAd
                var that = this
                var ad = mgc.createFeedAd({
                    container: dom
                })

                ad.onLoad(() => {
                    console.log('信息流加载成功')
                    that.showFeedAdBg = false
                    if(show){
                        ad.show()
                    }
                })

                ad.onError(() => {
                    console.log('信息流加载失败')
                })
                ad.load()
                return ad;      //返回实例
            }
        }

    }
</script>

<style scoped lang="less">
    @import '~assets/less/Mixins.less';

    .fade-egg{
        position: absolute;
        top:1rem;
        width: 100vw;
    }

    .alert {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1100;
    }

    .feedAd {
        display: block;
        height: 100%;
        background-image: image("~assets/img/hybrid/common/tjzm.png");
    }

    .small-egg{
        position: fixed;
        bottom: 10vw;
        right: 10vw;
        z-index: 2;
        img{
            display: inline-block;
            width: 1.48rem;
        }
    }

    .mask {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.4);
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

        .egg-text {
            font-size: 0.39rem;
            font-weight: Medium;
            font-family: PingFangSC-Medium, PingFang SC;
            line-height: 0.54rem;
            height: 0.54rem;
            letter-spacing: 2px;
            color: white;
            width: 3rem;
            text-align: center;
            margin:0.1rem auto;

        }

        .close{
            font-size:0.29rem;
            color:rgba(255,255,255,1);
            opacity: 60%;
        }

        .cover {
            position: relative;
            display: block;
            text-align: center;
            height: 5.6rem;
            margin: 0 auto;

            .tips{
                 font-size:0.29rem;
                font-family:PingFangSC-Regular,PingFang SC;
                font-weight:400;
                color:rgba(255,255,255,1);
                line-height:0.41rem;
                letter-spacing:1px;
                position: absolute;
                left: 10vw;
                top: 15vw;
            }

            .tips-line{
                font-size:0.29rem;
                line-height:0.41rem;
                letter-spacing:1px;
                position: absolute;
                left: 21vw;
                top: 23vw;
                width: 0.5rem;

            }

            .egg {
                display: block;
                height: 5rem;
                box-sizing: content-box;
                position: absolute;
                z-index: 2;
                top: 1rem;
                left: 0;
                right: 0;
                margin: 0 auto;
            }
            .jifen{
                display: inline-block;
                height:1.01rem;
                font-size:0.72rem;
                font-weight:500;
                color:rgba(255,224,16,1);
                line-height:1.01rem;
                letter-spacing:4px;
                position: absolute;
                top: 1.6rem;
                left: 0;
                right: 0;
                z-index: 2;
                margin: 0 auto;
            }

            .img-btn{
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                width: 3rem;
                z-index: 2;
                margin: 0 auto;
                animation: img-btn 1s linear;
                animation-iteration-count: infinite;
            }


            @keyframes   img-btn{
                0%{
                    width: 3rem;
                }
                50%{
                    width: 3.3rem;
                }
                100%{
                    width: 3rem;
                }
            }

            .egg-bg {
                position: absolute;
                display: block;
                width: 7rem;
                top: 0.5rem;
                /*z-index: 1;*/
                left: 0;
                right: 0;
                margin: 0 auto;
                animation: egg-animation 4s linear;
                animation-iteration-count: infinite;
            }

            @keyframes   egg-animation{
                0%{
                    transform:rotate(0deg);
                    width: 7rem;
                }
                50%{
                    transform:rotate(180deg);
                    width: 6rem;
                }
                100%{
                    transform:rotate(360deg);
                    width: 7rem;
                }
            }
        }

        .ad {
            width: 6.74rem;
            min-height: 3.81rem;
            position: relative;
            margin-top: 0.35rem;
            /*background-image:  linear-gradient(30deg,#FAD961,#64FA53,#48D7DC,#474CFF,#D500FF,#FF0000);*/
            border-radius: 0.25rem;
            overflow: hidden;
            padding: 0.07rem;
            margin: auto;
            box-sizing: content-box;


            .ad-content {
                display: flex;
                align-items: center;
                justify-content: center;
                position: absolute;
                margin: auto;
                width: 98%;
                height: 97%;
                border-radius: 0.18rem;
                left: 1%;
                top: 1.5%;
                z-index: 999;
                background-color: #12B1EC;

                img {
                    height: 100%;
                }
            }
        }

    }


</style>
