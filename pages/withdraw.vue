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
                    <div  class="withdraw" @click="withdrawLog"></div>
                    <div class="withdraw_tx" @click="withdrawLog">提现记录</div>
                </header>

                <div class="content">
                    <!-- TODO: 按钮条 -->
                    <div class="button-list" style="border-top: 0.8px solid #E3E3E3;">
                    </div>
                    <template>
                        <div class="list list-left">

                            <div class="row-game title">
                                <p style="margin-left: 0rem;">金币余额：{{my_coin}}</p>
                                <div class="add-flex">
                                    <div class="add-gold-wd">{约{{my_coin_rmb}}元}</div>
                                </div>
                            </div>
                        </div>
                    </template>

                    <template>
                        <div class="list list-left" style="border-bottom: 0.1rem solid #FFFFFF;">
                            <div class="row-game title">
                                <div class="shu"></div>
                                <p class="add-flex" style="margin-left: 0rem;">提现方式</p>
                            </div>

                            <div class="row-game title">
                                <div style="border: 0.02rem solid #3D9AF0;border-radius:0.16rem;height:0.81rem;">
                                    <div class="zfb"  style="display: inline-block;margin-left: 0.2rem"></div>
                                    <div class="withdraw_type"  style="display: inline-block;">{{withdraw_type}}</div>
                                    <div class="dg"  style="display: inline-block;"></div>
                                </div>

                            </div>
                        </div>
                    </template>

                    <template>
                        <div class="list list-left" style="border-bottom: 0.1rem solid #FFFFFF;" v-if="points.points">
                            <div class="row-game title">
                                <div class="shu"></div>
                                <p class="add-flex" style="margin-left: 0rem;">提现金额</p>
                                <div class="arrow-right"></div>
                            </div>
                            <div class="mgc-games-row">
                                <div class="mgc-game-row-point">
                                    <div v-if="index %3 == 0" v-for="(item, index) in points.points"
                                         :key="index" @click="withdraw(item.point_id,$event)" >
                                        <div class="name" name = "point_name" v-bind:id= "item.point_id" v-bind:data-point ="item.price" style="border: 0.02rem solid #3D9AF0;border-radius:0.16rem;width:2.08rem;height:0.81rem;line-height: .81rem;">{{item.price + item.coin_name}}</div>
                                    </div>
                                </div>
                                <div class="mgc-game-row-point">
                                    <div v-if="index %3 == 1" v-for="(item, index) in points.points"
                                         :key="index" @click="withdraw(item.point_id,$event)" >
                                        <div class="name" name = "point_name" v-bind:id= "item.point_id" v-bind:data-point ="item.price" style="border: 0.02rem solid #3D9AF0;border-radius:0.16rem;width:2.08rem;height:0.81rem;line-height: .81rem;">{{item.price + item.coin_name}}</div>
                                    </div>
                                </div>
                                <div class="mgc-game-row-point">
                                    <div v-if="index %3 == 2" v-for="(item, index) in points.points"
                                         :key="index" @click="withdraw(item.point_id,$event)" >
                                        <div class="name" name = "point_name" v-bind:id= "item.point_id" v-bind:data-point ="item.price"  style="border: 0.02rem solid #3D9AF0;border-radius:0.16rem;width:2.08rem;height:0.81rem;line-height: .81rem;">{{item.price + item.coin_name}}</div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </template>
                    <template>
                    <div style="width: 100%;text-align: center;border-bottom: 0.1rem solid #F5F5F5;">
                        <div style=" font-size: 0.2rem; margin-bottom: 0.1rem; text-align: left;background-color: #FFF9E9;width: 90%;margin-left: 0.32rem;" >

                            <div style = "font-size: 0.25rem;height: 0.6rem;line-height: 0.6rem;padding-left: 0.2rem">提现说明</div>
                            <div>
                                <textarea v-bind:rows="rows_textarea" style="width: 100%;background-color: #FFF9E9;border:none;padding-left: 0.2rem" disabled>{{points.explain}}</textarea>
                            </div>
                        </div>
                        <div v-bind:style="{height:this.tc_div_h+'px'}"></div>
                    </div>
                </template>
                    <template>
                        <div style="margin-top:0.3rem;width: 100%" @click="doDraw()">
                            <div style="margin:0 auto;width:4.05rem;height:0.81rem;background-color: #3D9AF0;font-size: 0.28rem;font-weight:600;color: #FFFFFF;border-radius:0.41rem;text-align: center;line-height: 0.81rem">立即提现</div>
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
import $ from 'jquery';
import '~/plugins/mgch5'

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
            my_coin_rmb:0,
            points:localStorage.getItem('points') || [],
            rows_textarea:10,
            withdraw_type: '支付宝',
            is_login:false,
            check_point_id:0,
            check_point_price:0,
            tc_div_h:0,

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

            alertInfo:'',
            maskreg : '<div id="maskreg" style="text-align:right;width: 100%;height:100%;background-color: rgba(0,0,0,.6);position: fixed;top: 0;left: 0;z-index: 800;" > </div >',

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
        let is_success = localStorage.getItem('is_success');
        if(is_success && is_success == 1){
            localStorage.setItem('is_success',0);
            this.preapply();
        }

        this.loadRemote()
        this.checkWithDrawInfo()
        this.getAliInfo()
       // this.listenScroll()
        this.tcdiv()
        mgc.getCoinConfig({
            success: res => {
                localStorage.setItem("app_conf",res);
            }
        })
        this.loadRemoteCoinNew()
        //this.setMemCoin()


		// update recent game list
		let newRecent = mgc.getRecentGameList()
		let newLen = newRecent.gameList ? newRecent.gameList.length : 0
		let oldLen = this.recentGameList.gameList ? this.recentGameList.gameList.length : 0
		if(newLen != oldLen) {
			this.recentGameList = newRecent
		}
    },


    methods: {
		getMGCGameCenterData() {
			// get info from native
			let appInfo = mgc.getAppInfoSync()
			let sysInfo = mgc.getSystemInfoSync()

			// build url
			let args = {
				dt: 0,
				open_token: '0023a78e02fb489528a99b7f9cb39ec',
                channel_id: this.$route.query.channel_id,
				client_id: 334,
				packagename: appInfo.packageName,
				leto_version: sysInfo.LetoVersion,
				framework_version: sysInfo.SDKVersion,
                mobile:mgc.getMgcUserId(),
				from: 11
			}
			let first = true
			let url = `${config.mgcUrl()}${config.mgcApiPathPrefix}${config.mgcPoints}`
			for(let key in args) {
				if(first) {
					url += '?'
					first = false
				} else {
					url += '&'
				}
				url += `${key}=${args[key]}`
			}
			// promise of http
			return http.get(url)
		},

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

        tcdiv(){
            let height=document.body.offsetHeight;//获取当前页面总高度
            let exit_hight = 740;
            if(height <= exit_hight){
                this.tc_div_h = 0;
            }else{
                this.tc_div_h = height-exit_hight;
            }
            //alert(this.tc_div_h);
            //alert(height-148);
            //var top=height+$(".topdiv").height();//顶部页面的高度（注意height计算的高度没有把顶部嵌套的页面高度加进去）
             //document.getElementById('tcdiv').css("top",height-148);//给底部页面添加绝对路径距离上面高度
        },

		loadRemote() {
			this.getMGCGameCenterData().then(mgcResp => {
				if(mgcResp && mgcResp.data && mgcResp.data.code == 200 && mgcResp.data.data) {
                    // save
                    // mgc.saveGameCenterDataToLocal(mgcResp.data.data)

                    // get banner data
                    let data = mgcResp.data.data;
                    //alert(JSON.stringify(this.points));
                    this.points = mgcResp.data.data;
                    let explain = data.explain;
                    let arr = explain.split("\n");
                    this.rows_textarea = arr.length + 1;
                    localStorage.setItem('points',mgcResp.data.data);
                }
			})
		},
        preapply() {
            this.preapplyData().then(mgcResp => {
                if(mgcResp && mgcResp.data && mgcResp.data.code == 200 ) {
                    //alert("提现申请成功，请耐心等待审核");
                    this.setAlertInfo("提现申请成功，请耐心等待审核");
                    var div=document.createElement("div");
                    div.innerHTML = this.alertInfo + this.maskreg;
                    document.body.appendChild(div);
                }else{
                    alert(mgcResp.data.msg);
                }
            })
        },

        preapplyData() {
            // get info from native
            let appInfo = mgc.getAppInfoSync()
            let sysInfo = mgc.getSystemInfoSync()

            // build url
            let args = {
                dt: 0,
                open_token: '0023a78e02fb489528a99b7f9cb39ec',
                channel_id: this.$route.query.channel_id,
                client_id: 334,
                packagename: appInfo.packageName,
                leto_version: sysInfo.LetoVersion,
                framework_version: sysInfo.SDKVersion,
                mobile:mgc.getMgcUserId(),
                account:window.mgc.getUserToken(),
                point_id:localStorage.getItem('draw_point_id'),
                from: 11
            }
            let first = true
            let url = `${config.mgcUrl()}${config.mgcApiPathPrefix}${config.mgcPreapply}`
            /*for(let key in args) {
                if(first) {
                    url += '?'
                    first = false
                } else {
                    url += '&'
                }
                url += `${key}=${args[key]}`
            }*/
            var data = encodeURIComponent(JSON.stringify(args));
            url = url + '?key=&data=' + data;
            // promise of http
            return http.get(url)
        },
        checkWithDrawInfo() {
            this.checkWithDrawInfoData().then(mgcResp => {
                console.log('checkWithDrawInfo ='+JSON.stringify(mgcResp))
                if(mgcResp && mgcResp.data && mgcResp.data.code == 200) {
                    this.is_login = true;//只考虑用户是否登录

                }else{
                    this.is_login = false;
                }
            })
        },

        checkWithDrawInfoData() {
            // get info from native
            let appInfo = mgc.getAppInfoSync()
            let sysInfo = mgc.getSystemInfoSync()

            // build url
            let args = {
                dt: 0,
                open_token: '0023a78e02fb489528a99b7f9cb39ec',
                channel_id: this.$route.query.channel_id,
                client_id: 334,
                packagename: appInfo.packageName,
                leto_version: sysInfo.LetoVersion,
                framework_version: sysInfo.SDKVersion,
                mobile:mgc.getMgcUserId(),
                from: 11
            }
            let first = true
            let url = `${config.mgcUrl()}${config.mgcApiPathPrefix}${config.mgcWithDrawInfo}`
            for(let key in args) {
                if(first) {
                    url += '?'
                    first = false
                } else {
                    url += '&'
                }
                url += `${key}=${args[key]}`
            }
            // promise of http
            return http.get(url)
        },


        getAliInfo() {
            this.getAliData().then(mgcResp => {
                if(mgcResp && mgcResp.data && mgcResp.data.code == 200 && mgcResp.data.data) {
                    let data = mgcResp.data.data;
                    //alert(JSON.stringify(mgcResp.data.data));
                    localStorage.setItem('ali_info',data)
                }
            })
        },

        getAliData() {
            // get info from native
            let appInfo = mgc.getAppInfoSync()
            let sysInfo = mgc.getSystemInfoSync()

            // build url
            let args = {
                dt: 0,
                open_token: '0023a78e02fb489528a99b7f9cb39ec',
                channel_id: this.$route.query.channel_id,
                client_id: 334,
                packagename: appInfo.packageName,
                leto_version: sysInfo.LetoVersion,
                framework_version: sysInfo.SDKVersion,
                mobile:mgc.getMgcUserId(),
                from: 11
            }
            let first = true
            let url = `${config.mgcUrl()}${config.mgcApiPathPrefix}${config.mgcAliInfo}`
            for(let key in args) {
                if(first) {
                    url += '?'
                    first = false
                } else {
                    url += '&'
                }
                url += `${key}=${args[key]}`
            }
            // promise of http
            return http.get(url)
        },

        //关闭
        back() {
			// TODO how to exit webview?
            //this.page = 1;
            //$(window).unbind('scroll');
            history.back();
        },
        setAlertInfo(msg){
            this.alertInfo = '<div id = "reloaddiv" style="position: fixed;top: 200px;left: 0px;right: 0px;background-size: cover;-webkit-background-size: cover;width: 300px;height: 200px;margin:auto;z-index:801;">' +
                '<form method="post" id="post_form" style="background-color: #FFFFFF;">' +
                '<div style="height: 220px;">' +
                '<div style="margin-left:20px;text-align: center;font-size: 20px;padding-top: 40px;height: 50px"> 温馨提示' +
                '</div>' +
                '<div style="margin-left:20px;margin-top: 40px;font-size: 15px;text-align: center">'+msg+
                '</div>' +
                '<input type="button"  name="button" onclick="window.mgcgame.reloadGame()" value="确定" style="border-radius: 50px;font-size: 19px;color: #FFFFFF;letter-spacing:1px;border: 0px; width: 246px;margin-top: 20px; margin-left: 28px;height: 45px;background-color: #476EFE;outline: none;">' +
                '</div>' +
                '</form>' +
                '</div>';
        },
        reloadGame(){
            document.getElementById("reloaddiv").remove();//隐藏
            document.getElementById('maskreg').remove();
        },
        //提现
        withdraw(point_id,ev) {
		    this.check_point_id = point_id;
		    this.check_point_price = ev.target.dataset.point;
		    let point_name_len =  document.getElementsByName("point_name").length;
            for(var i=0;i<point_name_len;i++){
                document.getElementsByName("point_name")[i].style.backgroundColor='';
                document.getElementsByName("point_name")[i].style.color='#000000';
            }
		    document.getElementById(point_id).style.backgroundColor = '#3D9AF0';
            document.getElementById(point_id).style.color = '#ffffff';
        },
        withdrawLog() {
            this.$router.push({path: './withdrawlog', query: {backable:true,channel_id:mgc.getChannelId(),title:'提现记录',is_day:0}});
        },
        doDraw(){
            let mobile = mgc.getMgcUserId();
            console.log("doDraw mobile = "+ mobile)
            let is_phone = this.isPoneAvailable(mobile);
            console.log("doDraw is_login = "+ this.is_login)
            if(!is_phone || false == this.is_login){
                window.mgc.showMgcLogin({
                    success: res => {
                        this.is_login = true;
                        console.log(`user login success`)
                    },
                    fail: res => {
                        console.log(`user login fail`)
                        return;
                    }
                })
            }
            if(this.is_login){
                if(0 == this.check_point_id){
                    alert("请选择提现金额");
                    return;
                }
                if(this.check_point_price > this.my_coin_rmb){
                    alert("您的金币余额不足");
                    return;
                }
                localStorage.setItem('draw_point_id',this.check_point_id);
                this.$router.push({path: './ali', query: {backable:true,channel_id:mgc.getChannelId(),title:'绑定支付宝',is_day:0}});
            }
        },
        isPoneAvailable(tel) {
            var reg =/^0?1[3|4|5|6|7|8|9][0-9]\d{8}$/;
            return reg.test(tel);
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
        loadRemoteCoinNew(){
			window.mgc.getUserCoin({
                success: data => {
					let coins = data;
					if(coins.hasOwnProperty("coins")) {
						this.my_coin = coins['coins'];
					};
					let conf = localStorage.getItem('app_conf');
					if(conf) {
						if(conf.hasOwnProperty('ex_coins') && conf['ex_coins']> 0){
							this.my_coin_rmb = (this.my_coin/conf['ex_coins']).toFixed(2);
						}
						if(conf.hasOwnProperty("is_ex") && 5 == conf['is_ex']){

						}else if(conf.hasOwnProperty("is_ex") && 1 == conf['is_ex']) {
							//this.withdraw_type = '提现到银行卡'
						}else if(conf.hasOwnProperty("is_ex") && 2 == conf['is_ex']) {
							// this.withdraw_type = '金币兑换第三方币'
						}else if(conf.hasOwnProperty("is_ex") && 3 == conf['is_ex']) {
							// this.withdraw_type = '提现到微信零钱'
						}else if(conf.hasOwnProperty("is_ex") && 4 == conf['is_ex']) {
							// this.withdraw_type = '第三方提现到微信零钱'
						}else{
							// this.withdraw_type = '不支持的提现类型'
						}
                    }
					localStorage.setItem('h5_mem_coins', data);
                }
            })
        },
        setMemCoin(){

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
            width: 0.43rem;
            height: 0.43rem;
            background: url("~assets/img/hybrid/common/tixianjilu.png") no-repeat;
            background-size: 100%;
            position: absolute;
            top: 0.26rem;
            right: 1.3rem;
        }

        .withdraw_tx {
            width: 1.32rem;
            height: 0.54rem;
            position: absolute;
            top: 0.26rem;
            right: 0.1rem;
            font-size: 0.21rem;
            font-weight: normal;
            line-height: 0.54rem;
            text-align: center;
            color: #666666;
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
            font-size: 0.2rem;
            color: #666666;
            border-radius: 0.16rem;
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


        .add-gold-wd {
            font-size: 0.2rem;
            color: #666666;
            border-radius: 0.16rem;
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
                background: url('~assets/img/hybrid/common/xiaojinbi.png') no-repeat;
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

            .mgc-game-row-point {
                display: inline-block;
                margin-right: 0.8rem;
                width: 20%;
                float: left;

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

.shu{
    width: 0.09rem;
    height: 0.42rem;
    background: url('~assets/img/hybrid/common/shu.png') no-repeat;
    background-size: cover;
    margin-right: 0.2rem;
}
.zfb{
    width:0.41rem;
    height:0.81rem;
    background: url('~assets/img/hybrid/common/zhifubao.png') no-repeat;
    background-size: 100%;
    background-position-y: center;
    float:left
}

.withdraw_type{
    height:0.81rem;
    font-size: 0.28rem;
    float:left;
    line-height:0.81rem;
    margin-left: 0.1rem;

}

.dg{
    width:0.41rem;
    height:0.79rem;
    background: url('~assets/img/hybrid/common/duigou.png') no-repeat;
    background-size: 100%;
    background-position-y: bottom;
    float:left

}
</style>
