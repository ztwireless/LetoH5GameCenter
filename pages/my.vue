<template>
    <div class="game" ref="root">
        <!-- 小游戏头部 -->
        <header class="header">
            <div v-if="backable" class="back" @click="back"></div>
            <h2>闲聊小游戏</h2>
        </header>

        <template>
            <div class="new-51">
                <header class="header">
                    <div v-if="backable" class="back" @click="back"></div>
                    <h2>{{title}}</h2>
                </header>

                <div class="content">
                    <!-- TODO: 按钮条 -->
                    <div class="button-list" style="border-top: 0.8px solid #E3E3E3;">
                    </div>
                    <template>
                        <div class="list list-left">

                            <div class="mgc-games-row">
                                <div class="mgc-game-row-coin">
                                    <img src="~assets/img/hybrid/common/huangdi.png" class="coin_imge"/>
                                    <div class="name">
                                        <div class="mgc-text">
                                            {{my_coin}}
                                            <p>我的金币余额</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="mgc-game-row-coin">
                                    <img src="~assets/img/hybrid/common/hongdi.png" class="coin_imge"/>
                                    <div class="name">
                                        <div class="mgc-text">
                                            {{my_coin_today}}
                                            <p>今日获得金币</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="mgc-game-row-coin" @click="point()">
                                    <img src="~assets/img/hybrid/common/landi.png" class="coin_imge"/>
                                    <div class="name-lj">
                                        <div class="mgc-text_lj">
                                            立即提现
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>

                    <template>
                        <div class="list list-left" v-if="recentGameList.gameList && recentGameList.gameList.length">
                            <div class="row-game title">
                                <p class="add-flex" style="margin-left: 0rem;">我的游戏</p>
                                <div class="arrow-right"></div>
                                <div class="showMore" style="height: 0.3rem;" @click="moreGamesMy()">查看全部</div>
                                <div class="showMoreImage" @click="moreGames(i.id,i.name,0)"></div>
                            </div>

                            <div class="mgc-games-row">
                                <div class="mgc-game-row" v-for="(item, index) in recentGameList.gameList" :key="index" @click="startMGCGame(item)">
                                    <img :src="item.icon" />
                                    <div class="name">{{cutFive(item.name)}}</div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template>
                        <div class="list list-left" style="border-bottom: 0.1rem solid #FFFFFF;">

                            <div class="row-game title" @click="cleanLocal()">
                                <div class="qingchu"></div>
                                <p class="add-flex-sz" >清除缓存</p>
                                <div class="arrow-right"></div>
                                <div class="showSz" ></div>
                            </div>

                            <div class="row-game title" v-if = "1 == 2">
                                <div class="daojishi"></div>
                                <p class="add-flex-sz" >显示游戏内计时器</p>
                                <div class="arrow-right"></div>
                                <div class="showSz" @click="showDJS()"></div>
                            </div>


                        </div>
                    </template>

                </div>

            </div>
        </template>
    </div>
</template>
<script>
import {http, qs} from '~/plugins/axios';
import config from '~/config';

import Share from '~/components/Share';
import { hybridPointAction } from '~/plugins/report';
import TimeBtn from '~/components/TimeBtn';
import Empty from '~/components/Empty';
import {NEWGAMES, BANNER} from '~/plugins/games';
import $ from 'jquery'

export default {
    name: 'games',

    components:{
        Share,
        Empty,
        TimeBtn,
    },

    head() {
        return {
            title: '闲聊小游戏'
        }
    },

   data() {
       let vm = this;
        return {
            backable: false, //头部是否显示后退按钮
            showWithdraw: false,
            lastClickTime: 0,

            title: '',
            page: 1,
            loading:false,
            footerText:'上滑加载更多',
            json_data: {},
            is_day: 0,
            my_coin:0,
            my_coin_today:0,

            games: [],
            favoriteGameList: [],
            recentGameList: [],

            nowIndex: 0,
            swiperOption: {
                spaceBetween : 10, // 距离两边得距离
                slidesPerView: 'auto',   //设置slider容器能够同时显示的slides数量
                centeredSlides: true,    //设定为true时，活动块会居中，而不是默认状态下的居左。
                speed: 500,
                noSwiping: false,        //设置为true时禁止切换
                paginationClickable: false,
                observer: true,
                observerParents: true,
                initialSlide: 0,

                on: {
                    slideChangeTransitionStart: function() {
                        vm.nowIndex = this.activeIndex;
                        // alert(this.activeIndex);//切换结束时，告诉我现在是第几个slide
                    },
                },
            },

            newGames: NEWGAMES,
            banners: BANNER
        }
    },

    asyncData({query, redirect, req}){
		function getLocalGameCenterData() {
        	return new Promise((resolve, reject) => {
        		let j = mgc.getLocalGameCenterData()
                resolve(j)
            })
        }

        return http.all([getLocalGameCenterData()])
            .then(http.spread(j => {
            	// if has cached data, use it now
                if(j) {
                	// get banner data
                    let dataList = j || []
                    let banners = {}
                    for(let idx in dataList) {
                    	let data = dataList[idx]
                    	if(data.styleCode == 'rotationChart') {
                    		banners = data
                            dataList.splice(idx, 1)
                            break
                        }
                    }

                    // return
					return {
                        title: query.title,
						backable: query.backable,
                        newGames: dataList,
						banners: banners,
                        is_day: query.is_day,
					}
                }
            })).catch((e) => {
            })
    },

    created() {

    },

    mounted() {
    	// 设置游戏根目录

        // ensure channel id is set


        this.loadRemote()
       // this.listenScroll()

		// update recent game list
		let newRecent = mgc.getRecentGameList()
		let newLen = newRecent.gameList ? newRecent.gameList.length : 0
		let oldLen = this.recentGameList.gameList ? this.recentGameList.gameList.length : 0
		if(newLen != oldLen) {
			this.recentGameList = newRecent
		}
    },


    methods: {
        listenScroll(){

            let self = this;
            $(window).scroll(function () {
                let scrollTop = $(window).scrollTop();
                let windowTop = $(window).height();
                let documentTop = $(document).height();
                if(documentTop - windowTop <= scrollTop){
                    self.loadRemote();
                    self.page++;
                    self.loading = true;
                }
            });
        },

		loadRemote() {
			window.mgc.getUserCoin({
                success: data => {
					if(data.hasOwnProperty("coins")){
						this.my_coin = data['coins'];
					}
					if(data.hasOwnProperty("today_coins")){
						this.my_coin_today = data['today_coins'];
					}
					localStorage.setItem('h5_mem_coins', data);
                }
            })
		},

        //关闭
        back() {
			// TODO how to exit webview?
            //this.page = 1;
            //$(window).unbind('scroll');
            history.back();
        },
        setMemCoin(){
            let coins = localStorage.getItem('h5_mem_coins');
            if(coins.hasOwnProperty("coins")) {
                this.my_coin = coins['coins'];
            };
            if(coins.hasOwnProperty("today_coins")){
                this.my_coin_today = coins['today_coins'];
            }
        },
        //提现
        withdraw() {
            window.mgc.showWithdraw();
        },
        point(){
		    //alert(mgc.getMgcUserId());
            //alert(localStorage.getItem('app_conf'));
            console.log(JSON.stringify(localStorage.getItem('app_conf')));
            this.$router.push({path: './withdraw', query: {backable:true,channel_id:mgc.getChannelId(),title:'提现',is_day:0}});
        },
        //更多游戏
        moreGames(id){
        },
        cleanLocal(){
            alert('清除缓存');
        },
        showDJS(){
            alert('倒计时');
        },
        //最近玩
        moreGamesMy(){
            //alert("最近玩");
            //alert(JSON.stringify(this.recentGameList));
            this.$router.push({path: './rencent', query: {backable:true,channel_id:mgc.getChannelId(),title:'我的游戏',is_day:0}});
        },

        // 启动 梦工厂 游戏
        startMGCGame(game) {
			// avoid quick click
			let now = Date.now()
            if(now - this.lastClickTime < 500) {
            	return
            }
            this.lastClickTime = now

            // report
            hybridPointAction({
                id: `mgc_${game.id}`
            });

            // start
			mgc.navigateToMiniProgram({ appId: game.id.toString() })
        },

        getFavoriteGameList() {
            this.favoriteGameList = mgc.getFavoriteGameList()
        },

        getRecentGameList() {
            this.recentGameList = mgc.getRecentGameList()
        },

        cutFive(str) {
            if (str.length > 6 ) {
                str = str.substring(0, 6);

                return str + '...'
            };

            return str;
        },

        // 截取字符串
        cutText(str) {
            if (str.length >= 18 ) {
                str = str.substring(0, 18);

                return str + '...'
            };

            return str;
        },
    },
}
</script>
<style lang="less" scoped>
@import '~assets/less/Mixins.less';

@titleLeft: .32rem;
// .game {
//     padding-top: 1.1rem;
// }
.game-list {
    // margin-top: 1.1rem;
    display: flex;
    flex-wrap: wrap;
    padding: 0 .24rem .46rem;
    justify-content: space-between;
}

.box-item {
    position:relative;
    width: 3.39rem;
    height: 4.72rem;
    margin: .24rem 0 0;
    border-radius: .24rem;

    // 标题
    h5 {
        width: 100;
        text-align: center;
        font-size: .44rem;
        color: #FFFFFF;
        font-weight: 800;
        margin: 2.89rem 0 0;
    }

    // 描述
    p {
        width: 100%;
        text-align: center;
        font-size: .24rem;
        color: #FFFFFF;
        margin-top: .11rem;
    }

    //按钮
    .btn {
        width: 1.44rem;
        height: .58rem;
        margin:.24rem auto;
        background:rgba(0,0,0, 0.1);
        border-radius: .29rem;
        font-size: .36rem;
        text-align:center;
        line-height: .58rem;

        span {
            color: #FFFFFF;
        }
    }
}

// 展示盒子
.show {
    position: relative;
    width: 7.02rem;
    margin: 0 auto;
    // margin-top: .24rem;
}

// 无实际意义的占位盒子
.useless:extend(.show) {
    margin: 0 .24rem;
    height: .64rem;
    font-size: .32rem;
    border-radius: 10px;
    background-image: linear-gradient(-90deg, #ff4940 0%, #ff8040 100%);

    .clock {
        position: absolute;
        width: .92rem;
        height: .72rem;
        left: 1.28rem;
        bottom: 0;
        background: no-repeat center/contain url('~assets/img/hybrid/game/adv.png');
    }

    span {
        position: absolute;
        color: #fff;
        left: 2.52rem;
        line-height: .64rem;
    }
}

.header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    height: .88rem;
    background: #fff;

    .back {
        width: 0.36rem;
        height: 0.36rem;
        background: url("~assets/img/hybrid/common/back-black.png") no-repeat;
        background-size: 100%;
        position: absolute;
        top: 0.26rem;
        left: 0.22rem;
    }

    h2 {
        font-size: 0.36rem;
        font-weight: normal;
        color: #17181A;
        text-align: center;
        margin: 0;
        padding: 0;
        height: 0.88rem;
        line-height: 0.88rem;
    }

    .more-right {
        position: absolute;
        top: 0;
        right: .26rem;
        height: .88rem;
        line-height: .22rem;

        .dot {
            float: left;
            width: 4px;
            height: 4px;
            border-radius: 100%;
            background: black;
            margin-right: 5px;
            margin-top: .4rem;
        }
    }
}

.wall {
    position: fixed ;
    right: .5rem;
    bottom: 1rem;
    width: 1.3rem;
    height: 1.26rem;
    background: url('~assets/img/hybrid/game/wall.png') no-repeat;
    background-size: 100% 100%;
}

.mgc {

}

.mgc-item {
    border-bottom: .2rem solid #eee;
    padding: .24rem;

    .title {
        font-size: .4rem;
        font-weight: bold;
        margin-bottom: .3rem;
    }
}

.mgc-games {
    display: flex;
    flex-wrap: wrap;
}

.mgc-game {
    width: 25%;
    text-align: center;
    margin-bottom: .2rem;
    padding: 0 .05rem;

    img {
        width: 1.3rem;
        height: 1.3rem;
    }

    .name {
        font-size: .3rem;
        margin-bottom: .1rem;
    }

    .desc {
        font-size: .24rem;
        color: #999;
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 2s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}



.new-51 {

    .header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 1000;
        height: .88rem;
        background: #fff;

        .back {
            width: 0.36rem;
            height: 0.36rem;
            background: url("~assets/img/hybrid/common/back-black.png") no-repeat;
            background-size: 100%;
            position: absolute;
            top: 0.26rem;
            left: 0.22rem;
        }

        .withdraw {
            width: 0.54rem;
            height: 0.54rem;
            background: url("~assets/img/hybrid/common/withdraw_pic.png") no-repeat;
            background-size: 100%;
            position: absolute;
            top: 0.26rem;
            right: 0.85rem;
        }

        .withdraw_tx {
            width: 0.66rem;
            height: 0.54rem;
            position: absolute;
            top: 0.26rem;
            right: 0.22rem;
            font-size: 0.3rem;
            font-weight: normal;
            line-height: 0.54rem;
            text-align: center;
        }

        .withdraw_red {
            width: 0.5rem;
            height: 0.5rem;
            background: url("~assets/img/hybrid/common/leto_mgc_withdraw_bubble_bg2.png") no-repeat;
            background-size: 100%;
            position: absolute;
            top: 0.05rem;
            right: 1.13rem;
            font-size: 0.18rem;
            font-weight: normal;
            text-align: center;
            color: #ffffff;
            padding-top: 0.02rem;
        }

        h2 {
            font-size: 0.36rem;
            font-weight: normal;
            color: #17181A;
            text-align: center;
            margin: 0;
            padding: 0;
            height: 0.88rem;
            line-height: 0.88rem;
        }
    }

    .row-game {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .content {
        padding: 1rem 0 0 0;
    }

    .list-banner {
        .banner-img {
            border-radius: 0.16rem;
            width: 100%;
            margin-bottom: 0.16rem;
        }

        .row-game {
            img {
                border-radius: 50%;
                margin-right: 0.16rem;
                width: 0.72rem;
                height: 0.72rem;
            }

            .game-info {
                flex: 1;
            }

            .name {
                color: #17181A;
                font-size: 0.28rem;
                margin-bottom: 0.1rem;
            }
            .play {
                color: #87898C;
                font-size: 0.18rem;
            }
        }

    }

    // .banner {
    //     margin-bottom: 0.12rem;
    //     padding: 0 0.32rem;
    //     img {
    //         border-radius: 0.16rem;
    //         width: 100%;
    //         height: 3rem;
    //     }
    // }


    .banner {
        .swiper-container {
            padding-bottom: 0.5rem;
        }

        img {
            width: 6.4rem;
            height: 3rem;
            border-radius: 0.32rem;
            display: block;
            margin: 0 auto;
        }

        .shadow {
            box-shadow: 0 10px 15px 0 rgba(0, 50, 127, .1);
        }
    }

    .button-list {

    }

    .title {
        font-size: 0.32rem;
        font-weight: bold;
        color: #17181A;
        margin-bottom: 0.32rem;

        p {
            margin-left: 0.14rem;
            margin-right: 0.14rem;
        }

        .add-flex {
            flex: 1;
        }

        .add-flex-sz {
            flex: 1;
            color: #333333;
            font-weight: normal
        }

        .add-gold {
            background-color: #FFF5E0;
            font-size: 0.3rem;
            border-radius: 0.16rem;
            color: #FA8C00;
            position: relative;
            line-height: 0.32rem;
            padding-right: 0.24rem;
            padding-left: 0.4rem;
            display: inline-block;
            padding-top: 0.02rem;
            font-weight: bold;

            &::before {
                position: absolute;
                content: '';
                width: 0.32rem;
                height: 0.32rem;
                background: url('~assets/img/hybrid/task/upd/gold.png') no-repeat;
                background-size: 100%;
                left: 0;
            }
        }
    }

    .recently {
        width: 0.3rem;
        height: 0.36rem;
        background: url('~assets/img/hybrid/game/recently.png') no-repeat;
        background-size: 100%;
    }

    .qingchu {
        width: 0.3rem;
        height: 0.36rem;
        background: url('~assets/img/hybrid/common/qingchu.png') no-repeat;
        background-size: 100%;
    }

    .daojishi {
        width: 0.3rem;
        height: 0.36rem;
        background: url('~assets/img/hybrid/common/daojishi.png') no-repeat;
        background-size: 100%;
    }

    .like {
        width: 0.3rem;
        height: 0.38rem;
        background: url('~assets/img/hybrid/game/like.png') no-repeat;
        background-size: 100%;
    }

    .coin {
        width: 0.36rem;
        height: 0.38rem;
        background: url('~assets/img/hybrid/game/coin.png') no-repeat;
        background-size: 100%;
    }

    .rank {
        width: 0.32rem;
        height: 0.36rem;
        background: url('~assets/img/hybrid/game/gold-title.png') no-repeat;
        background-size: 100%;
    }

    .hot {
        width: 0.32rem;
        height: 0.36rem;
        background: url('~assets/img/hybrid/game/hot.png') no-repeat;
        background-size: 100%;
    }

    .xiu {
        width: 0.28rem;
        height: 0.36rem;
        background: url('~assets/img/hybrid/game/xiu.png') no-repeat;
        background-size: 100%;
    }

    .common-game {
        height: 0.36rem;
        width: 0.32rem;
        background: url('~assets/img/hybrid/game/common-game.png') no-repeat;
        background-size: 100%;
    }

    .list-padding {
        padding: 0.32rem 0.32rem 0.32rem 0.32rem;
    }

    .list-padding-without-bottom {
        padding: 0.32rem 0.32rem 0rem 0.32rem;
    }

    .list-padding-without-top {
        padding: 0rem 0.32rem 0rem 0.32rem;
    }

    .bottom32 {
        padding-bottom: 0.32rem;
    }

    .list-left {
        padding-top: 0.32rem;
        .title {
            padding: 0 0.32rem;
        }

        .mgc-games-row {
            padding-left: 0.32rem;
        }
    }

    .btn {
        width: 1.1rem;
        height: 0.46rem;
        background-color: #FF9340;
        color: #FFF;
        line-height: 0.46rem;
        border-radius: 0.1rem;
        text-align: center;
        font-size: 0.24rem;
        margin: 0 auto;
    }

    .btn-border {
        width: 1.1rem;
        height: 0.46rem;
        background-color: #FFF;
        color: #3D9AF0;
        border: 0.02rem solid #3D9AF0;
        line-height: 0.42rem;
        border-radius: 0.1rem;
        text-align: center;
        font-size: 0.24rem;
        margin: 0 auto;
    }

    .list {
        border-bottom: 0.1rem solid #F5F5F5;

        .mgc-games-row {
            overflow-x: scroll;
            overflow-y: hidden;
            white-space: nowrap;

            &::-webkit-scrollbar {
                display: none;
            }

            .mgc-bottom {
                margin-bottom: 0.4rem;
            }

            .mgc-game-row {
                display: inline-block;
                margin-right: 0.8rem;
                width: 20%;

                p {
                    font-size: 0.22rem;
                    color: #87898C;
                    margin-bottom: 0.24rem;
                    text-align: center;
                }
            }

            .mgc-game-qx {
                margin-right: 0.8rem;
                width: 20%;

                p {
                    font-size: 0.22rem;
                    color: #87898C;
                    margin-bottom: 0.24rem;
                    text-align: center;
                }
            }

            .mgc-game-row-coin {
                display: inline-block;
                margin-right: 0.01rem;
                width:30%;
                p {
                    font-size: 0.22rem;
                    color: #FFF;
                    margin-bottom: 0.24rem;
                    text-align: center;
                    font-weight:400;
                }

                .name {
                    position: absolute;
                    margin-top: -1.33rem;
                    width: 100%;
                    height: 1rem;
                    color: #FFF;
                    display: flex;
                    align-items: center;
                    padding-left: 0.2rem;
                }

                .name-lj {
                    position: absolute;
                    margin-top: -1.43rem;
                    width: 100%;
                    height: 1rem;
                    color: #FFF;
                    display: flex;
                    align-items: center;
                    padding-left: 0.2rem;
                }
                .mgc-text {
                    font-size: 0.3rem;
                    text-align: left;
                    font-weight:600;
                }
                .mgc-text_lj {
                    font-size: 0.3rem;
                    text-align: left;
                    font-weight:600;
                }
            }

            .div_content_1{
                font-size: 0.22rem;
                color: #87898C;
                margin-bottom: 0.24rem;
                text-align: center;
            }
            .coin_imge{
                width:2.11rem;
                height:1.47rem;
            }
            .coin_imge_1{
                margin:auto;
                width:2.11rem;
                height:1.47rem;
                background: url('~assets/img/hybrid/common/huangdi.png') no-repeat;
                background-size: 100%;
            }
            .coin_imge_2{
                margin:auto;
                width:2.11rem;
                height:1.47rem;
                background: url('~assets/img/hybrid/common/hongdi.png') no-repeat;
                background-size: 100%;
            }
            .coin_imge_3{
                margin:auto;
                width:2.11rem;
                height:1.47rem;
                background: url('~assets/img/hybrid/common/landi.png') no-repeat;
                background-size: 100%;
            }

            img {
                width: 1.3rem;
                height: 1.3rem;
                border-radius: 0.24rem;
                display: block;
                margin: 0 auto;
                margin-bottom: 0.24rem;
            }

            .name {
                font-size: 0.28rem;
                margin-bottom: 0.1rem;
                text-align: center;
            }

        }

        .mgc-like {
            display: inline-block;
            margin-right: 0.16rem;
            position: relative;
            width: 30%;

            img {
                width: 3.28rem;
                height: 2.4rem;
                border-radius: 0.16rem;
                margin-bottom: 0;
            }

            .name {
                margin-bottom: 0;
                position: absolute;
                margin-top: -0.97rem;
                width: 100%;
                height: 1rem;
                color: #FFF;
                display: flex;
                align-items: center;
                padding-left: 0.18rem;
            }

            .mgc-text {
                text-align: left;
            }

            .icon-img {
                width: 0.76rem;
                height: 0.76rem;
                border-radius: 100%;
                margin: 0;
                padding: 0;
                margin-right: 0.18rem;
            }

            p {
                font-size: 0.18rem;
            }
        }


        .inline {
            margin-bottom: 0.34rem;
            img {
                width: 1.28rem;
                height: 1.28rem;
                border-radius: 0.24rem;
            }

            .rank-num {
                width: 0.48rem;
                font-size: 0.48rem;
                margin-right: 0.24rem;
            }

            .rank-1 {
                width: 0.48rem;
                height: 0.56rem;
                background: url('~assets/img/hybrid/game/rank-1.png') no-repeat;
                background-size: 100%;
                margin-right: 0.24rem;
            }

            .rank-2 {
                width: 0.48rem;
                height: 0.56rem;
                background: url('~assets/img/hybrid/game/rank-2.png') no-repeat;
                background-size: 100%;
                margin-right: 0.24rem;
            }

            .rank-3 {
                width: 0.48rem;
                height: 0.56rem;
                background: url('~assets/img/hybrid/game/rank-3.png') no-repeat;
                background-size: 100%;
                margin-right: 0.24rem;
            }

            .game-info {
                flex: 1;
                margin-left: 0.26rem;
                margin-right: 0.1rem;
            }

            .name {
                font-size: 0.32rem;
                color: #17181A;
                margin-bottom: 0.12rem;
            }

            .des {
                color: #87898C;
                font-size: 0.24rem;
                margin-bottom: 0.12rem;
                height: 0.24rem; // that's one line, 2em for 2 lines, etc...
                line-height: 0.24rem; // the height of one text line
                overflow: auto;
                text-overflow: ellipsis;
            }

            .play {
                color: #87898C;
                font-size: 0.18rem;
            }

            .play_tags{
                display: inline;
                color: #3D9AF0;
                background: #EBF4FD;
                border-radius: 0.1rem;
                padding: 0.05rem;
                margin-right: 0.1rem;
            }

            .play_tags_day{
                display: inline;
                color: #3D9AF0;
                padding: 0.05rem;
            }

            .play_tags_date{
                display: inline;
                color: #3D9AF0;
                background: #EBF4FD;
                border-radius: 0.1rem;
                padding: 0.05rem;
            }

            .start-btn {
                width: 1.36rem;
                height: 0.48rem;
                line-height: 0.48rem;
                color: #FFF;
                .linear-color-orange();
                border-radius: 0.24rem;
                font-size: 0.24rem;
                text-align: center;
            }

            .gold-img {
                width: 0.32rem;
                height: 0.32rem;
            }

            .bg-y {
                height: 0.33rem;
                background-color: #FFF5E0;
                border-radius: 0.16rem;
                margin-left: 0.2rem;
                padding: 0 0.2rem;
                line-height: 0.33rem;
            }

            .row-name {
                display: flex;
                align-items: center;
            }

            em {
                font-size: 0.24rem;
                color: #FA8C00;
                font-style: normal;
                flex: 1;
            }
        }

        .text-active {
            color: #FF8400;
        }
    }

    .video {
        height: .66rem;
        line-height: .66rem;
        color: #fff;
        width: 100%;
        height: 1.2rem;
        line-height: 1.2rem;
        background: url('http://static1.pezy.cn/img/2019-04-15/4342494177262820562.png') no-repeat;
        background-size: 100%;
        border-radius: .33rem;
        font-size: .32rem;
        padding-left: 0.9rem;
    }
    .footer {
        height: 0.8rem;
        width: 100%;
        background-color: #F5F5F5;
        padding-top: 0.2rem;
        text-align: center;
        font-size: 0.2rem;
        color: #87898C;
        em {
            font-style: normal;
            color: #FA9424;
        }
    }
}



.b-fixed {
    width: 100%;
}

.alert-51 {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1200;
}

.mask-51 {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, .6);
    z-index: 1;
}
.body{
    position: absolute;
    // background-color: #FFF;
    border-radius: 0.24rem;
    width: 7.2rem;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    padding:  0.44rem 0  0 0;
    color:  #383B3D;
    z-index: 99;
}
.showMore{
    float: right;
    font-size: .28rem;
    font-weight: normal;
    color: #666666;
    height: 0.3rem;
}
.showMoreImage{
    float: right;
    width: 0.3rem;
    height: 0.3rem;
    background: url('~assets/img/hybrid/common/quanbu.png') no-repeat;
    background-size: cover;
}

.showSz{
    float: right;
    width: 0.3rem;
    height: 0.3rem;
    background: url('~assets/img/hybrid/common/qianjin.png') no-repeat;
    background-size: cover;
}
</style>
