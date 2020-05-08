<template>
    <div class="alert">
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

                <!-- 表单部分-->
                <div  v-if="this.isLogin===true" class="form">
                    <input class="input"  placeholder="手机号"   type="text" >

                    <div class="verCode">
                        <input type="text" placeholder="请输入验证码" class="input code">
                        <div v-if="this.time==this.interval" class="getCode"  @click="getVerCode">获取验证码</div>
                        <div v-if="this.time!=this.interval" class="getCode time" style="color:rgba(153,153,153,1);">{{time}}重新获得</div>
                    </div>
                </div>

                <!--实名弹窗-->
                <div  v-if="this.isLogin===false" class="form">
                    <input class="input"  style="margin-bottom: 0" placeholder="请输入你的真实姓名"   type="text" >
                    <input class="input"  placeholder="请输入你的身份证号码"   type="text" >
                </div>

                <div class="btn-group">
                    <div class="btn btn1">试玩一小时</div>
                    <div class="btn btn2">登录/一键注册</div>
                </div>

                <!--协议-->
                <div class="protocol">
                    <div class="item">
                        <img class="ckeckbox" src="~assets/img/hybrid/common/choose.png" alt="选中">
                        <span style="color: #999999">已同意</span>
                        <span>用户协议</span>
                        、
                        <span>用户协议</span>
                    </div>
                    <div class="item"><img class="ckeckbox" src="~assets/img/hybrid/common/tips.png" alt="选中">防沉迷系统说明</div>
                </div>

                <!--警告-->
                <div class="warning">
                    <div class="item">*实名认证后，会同步启用未成年人防沉迷系统</div>
                    <div class="item">*本平台承诺绝不对外公开、透露或编辑此信息</div>
                    <div class="item"> *身份信息只能提交一次，不可修改，慎重填写</div>
                </div>


            </div>

        </div>
    </div>
</template>

<script>
    export default {
        name: 'LoginModal',
        props: {

            title: {
                type: String,
                default: "游戏用户实名登记通知"
            },

            content:{
                type: String,
                default: "为了加强未成年人保护，落实国家相关防沉迷政策要求，游戏用户需实名认证"
            },

            isLogin:{
                type: Boolean,
                default:false
            }
        },
        data(){
            return{
                time:60,
                interval:60,
            }
        },
        methods: {
            ok() {
                this.$emit('ok');
            },
            close(){
                this.$emit('close');
            },

            getVerCode(){
                var that=this

                //设置时间间隔
                var Interval=setInterval(()=>{
                    console.log('time',that.time)
                    if(that.time<=1){
                        that.time=that.interval;
                        clearInterval(Interval)
                    }else {
                        that.time--
                    }
                },1000)

                //请求数据

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
        font-size: 0.3rem;
        padding-bottom: 0.3rem;

        .protocol{
            margin-top: 0.22rem;
            .item{
                display: flex;
                font-size:0.21rem;
                font-family:PingFangSC-Regular,PingFang SC;
                font-weight:400;
                justify-content: center;
                margin-top: 0.1rem;
                span{
                    color: #3D9AF0;
                }

                .ckeckbox{
                    display: inline-block;
                    width:0.28rem;
                    height:0.28rem;
                    margin-right: 0.1rem;
                 }


            }
        }
        .warning{
            width:5rem;
             font-size:0.19rem;
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(243,86,86,1);
            text-align: center;
            line-height:0.38rem;
            letter-spacing:1px;
            margin: auto;
            margin-top: 0.16rem;
            .item{
                display: block;
                text-align: center;
            }
        }

        .btn-group{
            display: flex;
            width: 5.66rem;
            justify-content: space-around;
            margin: auto;
        }

        .btn{
            display: inline-block;
            height:0.76rem;
            border-radius:0.38rem;
            border:0.01rem solid rgba(61,154,240,1);
            text-align: center;
            font-size:0.28rem;
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            line-height: 0.76rem;
        }
        .btn1{
            width:1.67rem;
            margin-left: 0.42rem;
            color: #3D9AF0;
            border-color: #3D9AF0;
        }
        .btn2{
            width:3.13rem;
            margin-right: 0.42rem;
            color: white;
            background-color: #3D9AF0;
            margin-left: 0.2rem;
        }

        .form{
            display: block;
            width:4.78rem;
            margin: auto;

            input{
                background:none;
                outline:none;
                border:none;
                padding:0 0.29rem;
                box-sizing: border-box;

                font-size:0.26rem;
                font-family:PingFangSC-Regular,PingFang SC;
                font-weight:400;
                color:rgba(102,102,102,1);
                line-height:0.37rem;

            }
            input::placeholder{
                width:1.81rem;
                font-size:0.26rem;
                font-family:PingFangSC-Regular,PingFang SC;
                font-weight:400;
                color:rgba(169,169,169,1)
            }

            .input{
                width:4.78rem;
                height:0.76rem;
                background:rgba(228,228,228,1);
                border-radius:0.05rem;
                margin: 0.26rem 0;
            }

            .code{
                width:2.64rem;
            }

            .getCode{
                display: inline-block;
                width:1.73rem;
                height:0.53rem;
                border-radius:0.08rem;
                border:0.02rem solid rgba(61,154,240,1);
                font-size:0.24rem;
                font-family:PingFangSC-Medium,PingFang SC;
                font-weight:500;
                color:rgba(61,154,240,1);
                line-height:0.53rem;
                text-align: center;
                margin-left: 0.3rem;
            }

        }

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
