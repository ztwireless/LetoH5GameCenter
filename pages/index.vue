<template>
    <div class="game" ref="root">
        <!-- 小游戏头部 -->
        <header class="header" style="display: none">
            <div v-if="backable" class="back" @click="back"></div>
            <h2>闲聊小游戏</h2>
        </header>

        <template>

              <!--
             <button style="font-size: 0.3rem" @click="modalShow=1" >全国公祭日弹窗</button>
            <button  style="font-size: 0.3rem" @click="modalShow=2"  >实名认证提示1</button>
            <button  style="font-size: 0.3rem" @click="modalShow=3" >实名认证提示2</button>
            <button style="font-size: 0.3rem" @click="modalShow=4" >广告</button>
            -->
             <Modal v-if="this.modalShow==1"  @close="modalShow=0"  title="根据国务院公告，2020年4月4日为全国哀悼日"  content="梦工厂小游戏将于该日:9:50-10:50暂时关闭游戏服务，4月4日全天关闭游戏内交流区，和所有玩家一起表达对抗击新冠肺炎疫情斗争牺牲烈士和逝世同胞的深切哀悼。愿天下再无灾难，人民英雄精神永垂不朽。"  btn="退出游戏中心" ></Modal>

            <LoginModal  v-if="this.modalShow==2"   @close="modalShow=0"  ></LoginModal>
            <LoginModal  v-if="this.modalShow==3"   @close="modalShow=0"  :isLogin="true" ></LoginModal>



            <transition name='fade'>
            <div class="new-51" id="gameContent" v-if="show">
                <header class="header">
                    <div v-if="backable" class="back" @click="back"></div>
                    <div v-if="showRencent" class="withdraw_pic" @click="recentPlay"></div>
                    <div v-if="showRencent" class="withdraw_play" @click="recentPlay">最近在玩</div>
                    <div v-if="showWithdraw" class="withdraw"></div>


                    <div v-if="showWithdraw" class="withdraw_tx_coin" @click="withdraw"></div>
                    <div v-if="showWithdraw" class="withdraw_tx_coin_content" @click="withdraw">
                        <div style="margin-top: 0.13rem"  @click="withdraw">
                            <div class="add-gold-wd">{{my_coin}}</div>
                            <div class="add-gold-rmb">
                                {{my_coin_rmb}}元
                            </div>
                        </div>
                    </div>
                    <div class="tx_pic"  @click="withdraw"></div>
                </header>

                <div class="content">

                    <!-- banner -->
                    <div class="banner" v-if="banners.gameList && banners.gameList.length > 0">
                        <div class="swiper-container" v-swiper:mySwiper="swiperOption">
                            <div class="swiper-wrapper">
                                <img :src="item.pic" alt=""
                                    class="swiper-slide"
                                    v-for="(item, index) in banners.gameList"
                                    :key="index"
                                    :class="[{'shadow' : nowIndex == index}]"
                                    @click="startMGCGame(item)"
                                >
                            </div>
                        </div>
                    </div>

                    <!-- TODO: 按钮条 -->
                    <div class="button-list">
                    </div>

                    <!-- recent played games -->


                    <!-- 所有游戏 -->
                    <div v-for="(i, k) in newGames" :key="k">
                        <!-- gallery样式 -->
                        <template v-if="k == 2">
                            <div class="list list-left" v-if="recentGameList.gameList && recentGameList.gameList.length">
                                <div class="row-game title">
                                    <div class="recently"></div>
                                    <p class="add-flex">我的游戏</p>
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
                        <template v-if="i.styleCode == 'gallery'">
                            <div class="list list-left">
                                <!-- title -->
                                <div class="row-game title">
                                    <div v-if="!i.icon" class="coin"></div>
                                    <div v-else   class="coin" v-bind:style="{backgroundImage:'url('+i.icon+')',backgroundRepeat:'no-repeat'}" ></div>
                                    <p>{{i.name}}</p>
                                    <div class="add-flex">
                                        <div class="add-gold"  v-if="goldShow">+{{i.gold || 100}}</div>
                                    </div>
                                    <div v-if= "i.showmore == 1" class="showMore" style="height: 0.3rem;" @click="moreGames(i.id,i.name,0)">查看全部</div>
                                    <div v-if= "i.showmore == 1" class="showMoreImage" @click="moreGames(i.id,i.name,0)"></div>
                                </div>

                                <!-- gallery item -->
                                <div class="mgc-games-row">
                                    <div class="mgc-like" style="margin-bottom: 0.2rem" v-for="(item, index) in i.gameList" :key="index" @click="startMGCGame(item)">
                                        <img v-lazy="item.pic" />
                                        <div class="name">
                                            <img v-lazy="item.icon" class="icon-img" />
                                            <div class="mgc-text">
                                                {{cutFive(item.name)}}
                                                <p>{{item.play_num}}万人玩过</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>

                        <!-- 单行grid样式 -->
                        <template v-else-if="i.styleCode == 'horizontalList'">
                            <div class="list list-left">
                                <!-- title -->
                                <div class="row-game title">
                                    <div v-if="!i.icon" class="coin"></div>
                                    <div v-else   class="coin" v-bind:style="{backgroundImage:'url('+i.icon+')',backgroundRepeat:'no-repeat'}" ></div>
                                    <p>{{i.name}}</p>
                                    <div class="add-flex">
                                        <div class="add-gold" v-if="goldShow">+{{i.gold || 100}}</div>
                                    </div>
                                    <div v-if= "i.showmore == 1" class="showMore" @click="moreGames(i.id,i.name,0)">查看全部</div>
                                    <div v-if= "i.showmore == 1" class="showMoreImage" @click="moreGames(i.id,i.name,0)"></div>
                                </div>

                                <!-- grid item -->
                                <div class="mgc-games-row">
                                    <div class="mgc-game-row mgc-bottom"
                                        v-for="(item, index) in i.gameList"
                                        :key="index" @click="startMGCGame(item)">
                                        <img v-lazy="item.icon" />
                                        <div class="name">{{cutFive(item.name)}}</div>
                                        <p>{{item.play_num}}万人玩过</p>
                                        <div class="btn" v-if="index == 2">马上玩</div>
                                        <div class="btn-border" v-else>马上玩</div>
                                    </div>
                                </div>
                            </div>

                        </template>

                        <!-- 大图样式 -->
                        <template v-else-if="i.styleCode == 'bigPic'">
                            <div class="list list-left bottom32">
                                <!-- title -->
                                <div class="row-game title">
                                    <div v-if="!i.icon" class="coin"></div>
                                    <div v-else   class="coin" v-bind:style="{backgroundImage:'url('+i.icon+')',backgroundRepeat:'no-repeat'}" ></div>
                                    <p>{{i.name}}</p>
                                    <div class="add-flex">
                                        <div class="add-gold" v-if="goldShow">+{{i.gold || 100}}</div>
                                    </div>
                                    <div v-if= "i.showmore == 1" class="showMore" @click="moreGames(i.id,i.name,0)">查看全部</div>
                                    <div v-if= "i.showmore == 1" class="showMoreImage" @click="moreGames(i.id,i.name,0)"></div>
                                </div>

                                <!-- item -->
                                <div class="list-banner list-padding-without-top" v-if="i.gameList && i.gameList.length > 0">
                                    <img class="banner-img" @click="startMGCGame(i.gameList[0])" :src="i.gameList[0].pic" alt="">

                                    <div class="row-game">
                                        <img :src="i.gameList[0].icon" alt="">
                                        <div class="game-info">
                                            <div class="name">{{i.gameList[0].name}}</div>
                                            <div class="play">{{i.gameList[0].play_num}}万人玩过</div>
                                        </div>
                                        <div class="btn-border" @click="startMGCGame(i.gameList[0])">马上玩</div>
                                    </div>
                                </div>
                            </div>
                        </template>

                        <!-- 单排行样式 -->
                        <template v-else-if="i.styleCode == 'singleRanking'">
                            <div class="list list-padding-without-bottom">
                                <!-- title -->
                                <div class="row-game title">
                                    <div v-if="!i.icon" class="coin"></div>
                                    <div v-else   class="coin" v-bind:style="{backgroundImage:'url('+i.icon+')',backgroundRepeat:'no-repeat'}" ></div>
                                    <p>{{i.name}}</p>
                                    <div class="add-flex">
                                        <div class="add-gold" v-if="goldShow">+{{i.gold || 100}}</div>
                                    </div>
                                    <div v-if= "i.showmore == 1" class="showMore" @click="moreGames(i.id,i.name,i.rankList[0].id)">查看全部</div>
                                    <div v-if= "i.showmore == 1" class="showMoreImage" @click="moreGames(i.id,i.name,0)"></div>
                                </div>

                                <!-- list -->
                                <div class="row-game inline" v-for="(item, index) in i.rankList[0].gameList" :key="index" @click="startMGCGame(item)">
                                    <!-- rank icon -->
                                    <div class="rank-1" v-if="index == 0"></div>
                                    <div class="rank-2" v-else-if="index == 1"></div>
                                    <div class="rank-3" v-else-if="index == 2"></div>
                                    <div class="rank-num" v-else>{{index + 1}}</div>

                                    <!-- game icon, name, etc. -->
                                    <img v-lazy="item.icon" alt="">
                                    <div class="game-info-rank">
                                        <div class="name row-name">
                                            {{item.name}}
                                        </div>
                                        <div class="desRank">{{item.publicity}}</div>
                                    </div>
                                    <div class="btn-border">马上玩</div>
                                </div>
                            </div>
                        </template>

                        <!-- TODO: 多排行样式 -->
                        <template v-else-if="i.styleCode == 'moreRanking'">
                        </template>

                        <!-- TODO: 8 分类排行样式 -->
                        <template v-else-if="i.styleCode == 'category'">
                            <div class="list list-left">
                                <!-- title -->
                                <div class="row-game title">
                                    <div v-if="!i.icon" class="coin"></div>
                                    <div v-else   class="coin" v-bind:style="{backgroundImage:'url('+i.icon+')',backgroundRepeat:'no-repeat'}" ></div>
                                    <p>{{i.name}}</p>
                                    <div class="add-flex">
                                        <div class="add-gold" v-if="goldShow">+{{i.gold || 100}}</div>
                                    </div>
                                    <div v-if= "i.showmore == 1" class="showMore" @click="moreGamesFl(i.id,i.name,i.categoryList[0].id,i.categoryList)">查看全部</div>
                                    <div v-if= "i.showmore == 1" class="showMoreImage" @click="moreGames(i.id,i.name,0)"></div>
                                </div>

                                <!-- grid items -->
                                <div class="mgc-games-row">
                                    <div class="mgc-game-row-fl">
                                        <div v-if="index  % 2== 0" v-for="(item, index) in i.categoryList"
                                             :key="index" @click="moreGamesFl(i.id,i.name,item.id,i.categoryList)"
                                             style="background:#F5F5F5;border-radius:0.1rem;margin-bottom: 0.2rem;">
                                            <div style="display:flex;align-items: center;height:0.77rem;width: 1.75rem;margin: 0 auto">
                                                <img v-lazy="item.icon" style="width: 0.35rem;height: 0.35rem;margin: 0rem 0rem 0rem 0rem;border-radius: 0rem;"/>
                                                <p>{{cutFive(item.name)}}</p>
                                            </div>

                                        </div>
                                    </div>
                                    <div class="mgc-game-row-fl">
                                        <div v-if="index  % 2== 1" v-for="(item, index) in i.categoryList"
                                             :key="index" @click="moreGamesFl(i.id,i.name,item.id,i.categoryList)"
                                             style="background:#F5F5F5;border-radius:0.1rem;margin-bottom: 0.2rem;">
                                            <div style="display:flex;align-items: center;height:0.77rem;width: 1.75rem;margin: 0 auto">
                                                <img v-lazy="item.icon" style="width: 0.35rem;height: 0.35rem;margin: 0rem 0rem 0rem 0rem;border-radius: 0rem;"/>
                                                <p>{{cutFive(item.name)}}</p>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>

                        <!-- 3  单排游戏列表	singleHorizontalList -->
                        <template v-else-if="i.styleCode == 'singleHorizontalList'">
                            <div class="list list-left">
                                <!-- title -->
                                <div class="row-game title">
                                    <div v-if="!i.icon" class="coin"></div>
                                    <div v-else   class="coin" v-bind:style="{backgroundImage:'url('+i.icon+')',backgroundRepeat:'no-repeat'}" ></div>
                                    <p>{{i.name}}</p>
                                    <div class="add-flex">
                                        <div class="add-gold" v-if="goldShow">+{{i.gold || 100}}</div>
                                    </div>
                                    <div v-if= "i.showmore == 1" class="showMore" @click="moreGames(i.id,i.name,0)">查看全部</div>
                                    <div v-if= "i.showmore == 1" class="showMoreImage" @click="moreGames(i.id,i.name,0)"></div>
                                </div>

                                <!-- grid item -->
                                <div class="mgc-games-row">
                                    <div class="mgc-game-row mgc-bottom-qp"
                                         v-for="(item, index) in i.gameList"
                                         :key="index" @click="startMGCGame(item)">
                                        <img v-lazy="item.icon" />
                                        <div class="name">{{cutFive(item.name)}}</div>
                                        <div class="btn" v-if="index == 2">马上玩</div>
                                        <div class="btn-border" v-else>马上玩</div>
                                    </div>
                                </div>
                            </div>

                        </template>


                        <!-- 23  单张轮播图	singleHorizontalList -->
                        <template v-else-if="i.styleCode == 'signRotationChart'">
                            <!-- grid item -->
                            <div class="mgc-games-row">
                                <div class="" v-for="(item, index) in i.gameList" :key="index" @click="startMGCGame(item)">
                                    <img v-lazy="item.pic" />
                                </div>
                            </div>
                        </template>



                        <!-- TODO: 2  多排游戏列表 -->
                        <template v-else-if="i.styleCode == 'moreHorizontalList'">
                            <div class="list list-left bottom32">
                                <!-- title -->
                                <div class="row-game title">
                                    <div v-if="!i.icon" class="coin"></div>
                                    <div v-else   class="coin" v-bind:style="{backgroundImage:'url('+i.icon+')',backgroundRepeat:'no-repeat'}" ></div>
                                    <p>{{i.name}}</p>
                                    <div class="add-flex">
                                        <div class="add-gold" v-if="goldShow">+{{i.gold || 100}}</div>
                                    </div>
                                    <div v-if= "i.showmore == 1" class="showMore" @click="moreGames(i.id,i.name,0)">查看全部</div>
                                    <div v-if= "i.showmore == 1" class="showMoreImage" @click="moreGames(i.id,i.name,0)"></div>
                                </div>

                                <!-- grid items -->
                                <div class="mgc-games-row">
                                    <!-- row 1 -->
                                    <div class="mgc-game-row-three"
                                         v-if="index %3 == 0"
                                         v-for="(item, index) in i.gameList"
                                         :key="index" @click="startMGCGame(item)">

                                        <div class="row-game inline">
                                            <img v-lazy="item.icon" style="margin-left: 0px"/>
                                            <div class="game-info" style="width: 40%">
                                                <div class="name row-name">{{cutFive(item.name)}}</div>
                                                <div class="des">{{item.publicity}}</div>
                                                <div class="play">
                                                    <div class="play_tags" v-for="(item_tag, index_tag) in item.tags">
                                                        {{item_tag}}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="btn-border">马上玩</div>
                                        </div>

                                    </div>

                                    <br>

                                    <!-- row 2 -->
                                    <div class="mgc-game-row-three"
                                         v-if="index % 3 ==1"
                                         v-for="(item, index) in i.gameList"
                                         :key="index" @click="startMGCGame(item)">
                                        <div class="row-game inline" >
                                            <img v-lazy="item.icon" style="margin-left: 0px"/>
                                            <div class="game-info" style="width: 40%">
                                                <div class="name row-name">{{cutFive(item.name)}}</div>
                                                <div class="des">{{item.publicity}}</div>
                                                <div class="play">
                                                    <div class="play_tags" v-for="(item_tag, index_tag) in item.tags">
                                                        {{item_tag}}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="btn-border">马上玩</div>
                                        </div>
                                    </div>

                                    <br>
                                    <!-- row 3 -->
                                    <div class="mgc-game-row-three"
                                         v-if="index % 3 ==2"
                                         v-for="(item, index) in i.gameList"
                                         :key="index" @click="startMGCGame(item)">
                                        <div class="row-game inline" style="margin-bottom: 0rem;">
                                            <img v-lazy="item.icon" style="margin-left: 0px"/>
                                            <div class="game-info" style="width: 40%">
                                                <div class="name row-name">{{cutFive(item.name)}}</div>
                                                <div class="des">{{item.publicity}}</div>
                                                <div class="play">
                                                    <div class="play_tags" v-for="(item_tag, index_tag) in item.tags">
                                                        {{item_tag}}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="btn-border">马上玩</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>


                        <!-- 12 棋盘格布局 -->
                        <template v-else-if="i.styleCode == 'chessboard'">
                            <div class="list list-left">
                                <!-- title -->
                                <div class="row-game title">
                                    <div v-if="!i.icon" class="coin"></div>
                                    <div v-else   class="coin" v-bind:style="{backgroundImage:'url('+i.icon+')',backgroundRepeat:'no-repeat'}" ></div>
                                    <p>{{i.name}}</p>
                                    <div class="add-flex">
                                        <div class="add-gold" v-if="goldShow">+{{i.gold || 100}}</div>
                                    </div>
                                    <div v-if= "i.showmore == 1" class="showMore" @click="moreGames(i.id,i.name,0)">查看全部</div>
                                    <div v-if= "i.showmore == 1" class="showMoreImage" @click="moreGames(i.id,i.name,0)"></div>
                                </div>

                                <!-- grid items -->
                                <div class="mgc-games-row">
                                    <div class="mgc-game-row-qp">
                                        <div v-if="index %3 == 0" v-for="(item, index) in i.gameList"
                                             :key="index" @click="startMGCGame(item)" class="mgc-like-qp">
                                                <img v-lazy="item.pic" />
                                                <div v-if="!item. backgroundcolor" class="name">
                                                    <div class="mgc-text" >
                                                        {{cutFive(item.name)}}
                                                        <p>{{item.play_num}}万人玩过</p>
                                                    </div>
                                                </div>
                                                <div v-else class="name"  v-bind:style="{ background: item.backgroundcolor}">
                                                    <div class="mgc-text" >
                                                        {{cutFive(item.name)}}
                                                        <p>{{item.play_num}}万人玩过</p>
                                                    </div>
                                                </div>
                                        </div>
                                    </div>
                                    <div class="mgc-game-row-qp">
                                        <div v-if="index %3 == 1" v-for="(item, index) in i.gameList"
                                             :key="index" @click="startMGCGame(item)" class="mgc-like-qp">
                                            <img v-lazy="item.pic" />
                                            <div v-if="!item. backgroundcolor" class="name" >
                                                <div class="mgc-text" >
                                                    {{cutFive(item.name)}}
                                                    <p>{{item.play_num}}万人玩过</p>
                                                </div>
                                            </div>
                                            <div v-else class="name"  v-bind:style="{ background: item.backgroundcolor}">
                                                <div class="mgc-text" >
                                                    {{cutFive(item.name)}}
                                                    <p>{{item.play_num}}万人玩过</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mgc-game-row-qp">
                                        <div v-if="index %3 == 2" v-for="(item, index) in i.gameList"
                                             :key="index" @click="startMGCGame(item)" class="mgc-like-qp">
                                            <img v-lazy="item.pic" />
                                            <div v-if="!item. backgroundcolor" class="name" >
                                                <div class="mgc-text" >
                                                    {{cutFive(item.name)}}
                                                    <p>{{item.play_num}}万人玩过</p>
                                                </div>
                                            </div>
                                            <div v-else class="name"  v-bind:style="{ background: item.backgroundcolor}">
                                                <div class="mgc-text" >
                                                    {{cutFive(item.name)}}
                                                    <p>{{item.play_num}}万人玩过</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </template>



                        <!-- 11 一天一个好游戏 -->
                        <template v-else-if="i.styleCode == 'dayGames'">
                            <div class="list list-left" style="background-image: linear-gradient(#7E72FB, #60D1FD);">
                                <!-- title -->
                                <div class="row-game title">
                                    <div v-if="!i.icon" class="coin" ></div>
                                    <div v-else   class="coin" v-bind:style="{backgroundImage:'url('+i.icon+')',backgroundRepeat:'no-repeat'}" ></div>
                                    <p style="color: #FFFFFF">{{i.name}}</p>
                                    <div class="add-flex">
                                        <div class="add-gold" style="background-color: rgba(0,0,0,0.2);color:#FFFFFF;font-size: 0.26rem;" v-if="goldShow">+{{i.gold || 100}}</div>
                                    </div>
                                    <div v-if= "i.showmore == 1" class="showMore" @click="moreGamesDay(i.id,i.name,0,1)" style="color: #FFFFFF">查看全部</div>
                                    <div v-if= "i.showmore == 1" class="showMoreImageWhite" @click="moreGamesDay(i.id,i.name,0,1)"></div>
                                </div>

                                <!-- grid item -->
                                <div class="mgc-games-row" >
                                    <div class="mgc-game-row" style="width: 15%; margin-bottom: 0.2rem;"
                                         v-for="(item, index) in i.gameList"
                                         :key="index" @click="startMGCGame(item)"
                                         v-if = "item.game_date">
                                        <img v-lazy="item.icon" style="width: 1rem;height: 1rem"/>
                                        <div class="name" style="color: #FFFFFF;font-size: 0.24rem;font-weight:600">{{cutFive(item.name)}}</div>
                                        <p></p>
                                        <div class="btn-border" style="background-color: rgba(0,0,0,0.2);border-radius:0.3rem;color:#FFFFFF;font-size: 0.26rem; ">{{item.game_date}}</div>
                                    </div>
                                </div>
                            </div>

                        </template>


                        <!-- 双行grid, 后跟大图, 这个作为缺省样式 -->
                        <template v-else>
                            <div class="list list-left bottom32">
                                <!-- title -->
                                <div class="row-game title">
                                    <div v-if="!i.icon" class="coin"></div>
                                    <div v-else   class="coin" v-bind:style="{backgroundImage:'url('+i.icon+')',backgroundRepeat:'no-repeat'}" ></div>
                                    <p>{{i.name}}</p>
                                    <div class="add-flex">
                                        <div class="add-gold" v-if="goldShow">+{{i.gold || 100}}</div>
                                    </div>
                                    <div v-if= "i.showmore == 1" class="showMore" @click="moreGames(i.id,i.name,0)">查看全部</div>
                                    <div v-if= "i.showmore == 1"  class="showMoreImage" @click="moreGames(i.id,i.name,0)"></div>
                                </div>

                                <!-- grid items -->
                                <div class="mgc-games-row">
                                    <!-- row 1 -->
                                    <div class="mgc-game-row mgc-bottom"
                                        v-if="index %2 == 0"
                                        v-for="(item, index) in i.gameList"
                                        :key="index" @click="startMGCGame(item)">
                                        <img v-lazy="item.icon" />
                                        <div class="name">{{cutFive(item.name)}}</div>
                                        <p>{{item.play_num}}万人玩过</p>
                                        <div class="btn" v-if="index == 2">马上玩</div>
                                        <div class="btn-border" v-else>马上玩</div>
                                    </div>

                                    <br>

                                    <!-- row 2 -->
                                    <div class="mgc-game-row"
                                        v-if="index % 2 !=0"
                                        v-for="(item, index) in i.gameList"
                                        :key="index" @click="startMGCGame(item)">
                                        <img v-lazy="item.icon" />
                                        <div class="name">{{cutFive(item.name)}}</div>
                                        <p>{{item.play_num}}万人玩过</p>
                                        <div class="btn-border">马上玩</div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                    <div  v-if = "1 == add_desktop" class="add-win" id="add_win">
                        <div class="add-win-txt"><span>选择“添加到主屏幕”</span><br/><span>即可收藏游戏到桌面</span></div>
                        <img src="~assets/img/hybrid/common/sx.png" class="add-win-line" style="height: 50px;"/>
                        <div class="add-win-class" @click="closewin()"><span>关闭</span></div>
                    </div>

                </div>


                <!-- footer -->
                <div class="footer">
                    不断更新更多好玩的<em style="color: #3D9AF0">游戏</em>
                </div>
            </div>
            </transition>
            <div class="add-win-page-new" id="splashContent" @click="show = !show"  v-if="!show&&(1 == splash_show)"></div>

            <Ad v-if="this.modalShow==4"  v-show="!(!show&&(1 == splash_show))"   :img_url="ad.img_url"  @close="modalShow=0"  @openGame="openGame"> </Ad>
        </template>
    </div>
</template>
<script>
import {http, qs} from '~/plugins/axios';
import config from '~/config';

import Share from '~/components/Share';
import Ad from '~/components/Ad';
import Modal from '~/components/Modal';
import LoginModal from '~/components/LoginModal';



import { hybridPointAction } from '~/plugins/report';
import TimeBtn from '~/components/TimeBtn';
import Empty from '~/components/Empty';
import {NEWGAMES, BANNER} from '~/plugins/games';

export default {
    name: 'games',

    components:{
        Share,
        Empty,
        TimeBtn,
        Ad,
        Modal,
        LoginModal
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
            showWithdraw: true,
            showRencent: false,
            lastClickTime: 0,

            goldShow: false, //是否显示金币样式
            add_desktop :localStorage.getItem('add_desktop') || 1,

            games: [],
            favoriteGameList: [],
            recentGameList: [],
            show: false,
            splash_show: sessionStorage.getItem('splash_show') || 1,

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
            banners: BANNER,

            //广告数据
            ad:{

            },
            modalData:{
                title:'温馨提示',
                content:'梦工厂小游戏将于该日:9:50-10:50暂时关闭游戏服务，4月4日全天关闭游戏内交流区，和所有玩家一起表达对抗击新冠肺炎疫情斗争牺牲烈士和逝世同胞的深切哀悼。愿天下再无灾难，人民英雄精神永垂不朽。'
            },
            modalShow:4,
            adShow:true,
            my_coin:0,
            my_coin_rmb:0,
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
                if(j.gameCenterData) {
                	// get banner data
                    let dataList = j.gameCenterData || []
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
						backable: query.backable,
                        newGames: dataList,
						banners: banners
					}
                }
            })).catch((e) => {
            })
    },

    mounted() {
        // 设置游戏根路径
		mgc.setJSGameRootUrl('http://h5.jrutech.com/games/games')
        // save channel id from url, parameter name is c
        let channelId = null
		let qs = window.location.search
		if(qs.startsWith('?')) {
			qs = qs.substring(1)
		}
		let pairs = qs.split('&')
		for(let pair of pairs) {
			let kv = pair.split('=')
			if(kv.length == 2 && kv[0] == 'c') {
				channelId = kv[1]
                break
			}
		}
		channelId = channelId || '1001187'
        mgc.setChannelId(channelId)


        // load remote game list
        this.loadRemote()

        //渠道配置
        mgc.getCoinConfig({
            success: res => {
                //asyncData  预加载
                //alert(`got config: ${JSON.stringify(res)}`)
                if(res.hasOwnProperty("is_coin")){
                    if(0 == res['is_coin']){//普通游戏中心
                        this.showRencent = true;
                        this.showWithdraw = false;
                        this.goldShow = false;
                    }else{//金币游戏中心
                        this.showRencent = false;
                        this.showWithdraw = true;
                        this.goldShow = true;
                    }
                }
                localStorage.setItem("app_conf",res);
            }
        })

        //设置
        this.setSplashShow();
        setTimeout(this.getElevatorList, 1000);
		this.isWeiXin();

		// update recent game list
		let newRecent = mgc.getRecentGameList()
        console.log('newRecent',newRecent)
		let newLen = newRecent.gameList ? newRecent.gameList.length : 0
		let oldLen = this.recentGameList.gameList ? this.recentGameList.gameList.length : 0
		if(newLen != oldLen) {
			this.recentGameList = newRecent
		}

		//用户信息
        let mgcUserInfo = mgc.getMgcUserInfo();
		console.log(JSON.stringify(mgcUserInfo));
    },

    methods: {

        openGame(){
            console.log('sadsad')
        },



        //关闭广告
        adClose(){
            this.adShow=false
        },

		getMGCGameCenterData() {
			// get info from native
			let appInfo = mgc.getAppInfoSync()
			let sysInfo = mgc.getSystemInfoSync()
			// build url
			let args = {
				dt: 0,
				open_token: '0023a78e02fb489528a99b7f9cb39ec',
				app_id: mgc.getChannelId(),
				client_id: 334,
				packagename: appInfo.packageName,
				leto_version: sysInfo.LetoVersion,
				framework_version: sysInfo.SDKVersion,
				from: 11
			}
			let first = true
			let url = `${config.mgcProdUrl}${config.mgcApiPathPrefix}${config.mgcApiGetGameCenterData}`
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

        getMGCGameCenterDataTest() {
		    //let args = "{\"point_id\":691,\"type\":3,\"mobile\":\"13552886455\",\"agentgame\":\"\",\"app_id\":\"364775\",\"channel_id\":364775,\"client_id\":\"334\",\"device\":{\"device_id\":\"351ad57b19cf9c976faefbb08a41ccd8\",\"deviceinfo\":\"android10\",\"idfa\":\"\",\"idfv\":\"\",\"ipaddrid\":\"\",\"local_ip\":\"192.168.101.27\",\"mac\":\"48:2c:a0:77:5a:8c\",\"userua\":\"Mozilla/5.0 (Linux; Android 10; MI 8 Build/QKQ1.190828.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/78.0.3904.96 Mobile Safari/537.36\"},\"device_md5\":\"802F44C2F157068A825A09623D5EF23C\",\"framework_version\":\"3.2.0\",\"from\":\"11\",\"leto_version\":\"android_v3.9.2\",\"packagename\":\"com.mgc.letobox.happy\",\"timestamp\":1588578150234,\"user_token\":\"dFGp10vQNjTUcx32ZOz2Bn0ANKmsRum7N9WApSw5ZkWeRo2taRWEs93yMyGIZBqEM2WkcxO0O0OK\"}";
		    let  url ="http://search.mgc-games.com:8711/api/v7/wx/preapply?data={%22point_id%22:691,%22type%22:3,%22mobile%22:%2213552886455%22,%22agentgame%22:%22%22,%22app_id%22:%22364775%22,%22channel_id%22:364775,%22client_id%22:%22334%22,%22device%22:{%22device_id%22:%22351ad57b19cf9c976faefbb08a41ccd8%22,%22deviceinfo%22:%22android10%22,%22idfa%22:%22%22,%22idfv%22:%22%22,%22ipaddrid%22:%22%22,%22local_ip%22:%22192.168.101.27%22,%22mac%22:%2248:2c:a0:77:5a:8c%22,%22userua%22:%22Mozilla/5.0%20(Linux;%20Android%2010;%20MI%208%20Build/QKQ1.190828.002;%20wv)%20AppleWebKit/537.36%20(KHTML,%20like%20Gecko)%20Version/4.0%20Chrome/78.0.3904.96%20Mobile%20Safari/537.36%22},%22device_md5%22:%22802F44C2F157068A825A09623D5EF23C%22,%22framework_version%22:%223.2.0%22,%22from%22:%2211%22,%22leto_version%22:%22android_v3.9.2%22,%22packagename%22:%22com.mgc.letobox.happy%22,%22timestamp%22:1588578150234,%22user_token%22:%22dFGp10vQNjTUcx32ZOz2Bn0ANKmsRum7N9WApSw5ZkWeRo2taRWEs93yMyGIZBqEM2WkcxO0O0OK%22}";
            return http.get(url)
        },
        loadRemoteTest(){
            this.getMGCGameCenterDataTest().then(mgcResp => {
                if(mgcResp && mgcResp.data && mgcResp.data.code == 200 && mgcResp.data.data) {
                    // save
                    console.log("success = " + JSON.stringify(mgcResp));
                } else {
                    console.log("faile = " + JSON.stringify(mgcResp));
                }
            })
        },

		loadRemote() {
			this.getMGCGameCenterData().then(mgcResp => {
				if(mgcResp && mgcResp.data && mgcResp.data.code == 200 && mgcResp.data.data) {
					// save
                    mgc.saveGameCenterDataToLocal(mgcResp.data.data)

					// get banner data
					let dataList = mgcResp.data.data.gameCenterData || []
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
					this.banners = banners;
					this.newGames = dataList;
				} else {
					if(this.newGames.length <= 0) {
						this.banners = BANNER
						this.newGames = NEWGAMES
					}
				}
			})
		},

        //关闭
        back() {
			// TODO how to exit webview?
        },

        //提现
        withdraw() {
            //window.mgc.showWithdraw();
            //alert('提现设置');
            //this.loadRemoteTest();//mgc.getCoinConfig()
            //alert(mgc.getCoinConfig());
            this.$router.push({path: './my', query: {backable:true,channel_id:mgc.getChannelId(),title:'我的',is_day:0}});
        },
        //最近玩
        recentPlay(){
		    //alert("最近玩");
		    //alert(JSON.stringify(this.recentGameList));
            this.$router.push({path: './rencent', query: {backable:true,channel_id:mgc.getChannelId(),title:'最近使用',is_day:0}});
        },
        //更多游戏
        moreGames(id,title,lid){
            this.$router.push({path: './detail', query: {type_id: id,backable:true,channel_id:mgc.getChannelId(),title:title,lid:lid,is_day:0}});

        },
        //最近玩
        moreGamesMy(){
            //alert("最近玩");
            //alert(JSON.stringify(this.recentGameList));
            this.$router.push({path: './rencent', query: {backable:true,channel_id:mgc.getChannelId(),title:'我的游戏',is_day:0}});
        },
        moreGamesDay(id,title,lid,is_day){
            this.$router.push({path: './detail', query: {type_id: id,backable:true,channel_id:mgc.getChannelId(),title:title,lid:lid,is_day:is_day}});

        },
        getElevatorList(){
            if(!this.show&&(1 == this.splash_show)){
                document.getElementById("splashContent").click();
                sessionStorage.setItem("splash_show",2);
            }
        },
        setSplashShow(){
            if(2 == this.splash_show){
                this.show = true;
            }
        },
        //更多游戏类别
        moreGamesFl(id,title,lid,categoryList){
            this.$router.push({path: './detailfl', query: {type_id: id,backable:true,channel_id:mgc.getChannelId(),title:title,lid:lid,categoryList:JSON.stringify(categoryList)}});

        },
        closewin() {
            document.getElementById("add_win").style.display = 'none';
            localStorage.setItem('add_desktop',2);
        },
        isWeiXin() {
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                this.add_desktop = 2;
            }
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

            // save to recent game list
            mgc.saveRecentGame(game)

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
            if (str.length > 5 ) {
                str = str.substring(0, 5);

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
            width: 0.88rem;
            height: 0.97rem;
            background: url("~assets/img/hybrid/common/zajindan.png") no-repeat;
            background-size: 100%;
            position: absolute;
            top: 0.1rem;
            right: 0.22rem;
        }

        .withdraw_pic {
            width: 0.54rem;
            height: 0.54rem;
            background: url("~assets/img/hybrid/common/shoucang.png") no-repeat;
            background-size: 100%;
            position: absolute;
            top: 0.26rem;
            right: 1.45rem;
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

        .withdraw_play {
            width: 1.2rem;
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
            font-weight:normal;
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

    .like {
        width: 0.3rem;
        height: 0.38rem;
        background: url('~assets/img/hybrid/game/chidou.png') no-repeat;
        background-size: 100%;
    }

    .coin {
        width: 0.36rem;
        height: 0.38rem;
        background: url('~assets/img/hybrid/game/chidou.png') no-repeat;
        background-size: 100%;
    }

    .rank {
        width: 0.32rem;
        height: 0.36rem;
        background: url('~assets/img/hybrid/game/chidou.png') no-repeat;
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
        background: url('~assets/img/hybrid/game/chidou.png') no-repeat;
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
        background-color: #FFF;
        color: #3D9AF0;
        border: 0.02rem solid #3D9AF0;
        line-height: 0.42rem;
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

            .mgc-bottom-qp {
                margin-bottom: 0.2rem;
            }

            .mgc-game-row {
                display: inline-block;
                margin-right: 0.4rem;
                width: 20%;

                p {
                    font-size: 0.22rem;
                    color: #87898C;
                    margin-bottom: 0.24rem;
                    text-align: center;
                }
            }


            .mgc-game-row-qp {
                display: inline-block;
                margin-right: 0.2rem;
                float: left;
                width: 30%;
                text-align: center;

                p {
                    font-size: 0.14rem;
                    color: #FFF;
                    margin-bottom: 0.22rem;
                    text-align: left;
                }
            }

            .mgc-game-row-fl {
                display: inline-block;
                margin-right: 0.2rem;
                float: left;
                width: 46.5%;
                text-align: center;
                margin-bottom: 0.1rem;

                p {
                    color: #000000;
                    width:1.15rem;
                    height:0.38rem;
                    font-size:0.27rem;
                    font-weight:400;
                    line-height:0.38rem;
                    letter-spacing:2px;
                    margin-left: 0.25rem;
                }
            }


            .mgc-game-row-three {
                display: inline-block;
                margin-right: 0.5rem;
                width: 90%;

                p {
                    font-size: 0.22rem;
                    color: #87898C;
                    margin-bottom: 0.24rem;
                    text-align: center;
                }
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
                background: url('~assets/img/hybrid/game/mask-img.png') no-repeat;
                background-size: 100%;
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

        .mgc-like-qp {
            //margin-right: 0.1rem;
            //margin-bottom: 0.24rem;
            position: relative;
            width:2.09rem;
            margin:0rem auto;
            margin-bottom: 1.04rem;

            img {
                width:2.09rem;
                height:2.13rem;
                margin-bottom: -0.1rem;
                border-radius: 0rem;
                border-top-left-radius: 0.16rem;
                border-top-right-radius: 0.16rem;
            }

            .name {
                margin-bottom: 0;
                position: absolute;
                width:100%;
                height: 0.8rem;
                color: #FFF;
                display: flex;
                align-items: center;
                padding-left: 0.1rem;
                padding-top: 0.18rem;
                background: url('~assets/img/hybrid/game/mask-img.png') no-repeat;
                background-size: 100%;
                border-bottom-right-radius: 0.16rem;
                border-bottom-left-radius: 0.16rem;
                background: #4D8FFF;
            }

            .mgc-text {
                text-align: left;
                font-size: 0.28rem;

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
                background: url('~assets/img/hybrid/game/jin.png') no-repeat;
                background-size: 100%;
                margin-right: 0.24rem;
            }

            .rank-2 {
                width: 0.48rem;
                height: 0.56rem;
                background: url('~assets/img/hybrid/game/tong.png') no-repeat;
                background-size: 100%;
                margin-right: 0.24rem;
            }

            .rank-3 {
                width: 0.48rem;
                height: 0.56rem;
                background: url('~assets/img/hybrid/game/yin.png') no-repeat;
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
                height: 0.48rem; // that's one line, 2em for 2 lines, etc...
                line-height: 0.24rem; // the height of one text line
                overflow: auto;
                text-overflow: ellipsis;
            }

            .game-info-rank {
                flex: 1;
                margin-left: 0.26rem;
                margin-right: 0.1rem;
                width: 40%;
            }

            .desRank {
                color: #87898C;
                font-size: 0.24rem;
                line-height: 0.24rem; // the height of one text line
                overflow: auto;
                text-overflow: ellipsis;
                white-space: nowrap;
                -o-text-overflow:ellipsis;
                width:100%;
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
.showMoreImageWhite{
    float: right;
    width: 0.3rem;
    height: 0.3rem;
    background: url('~assets/img/hybrid/common/quanbubai.png') no-repeat;
    background-size: cover;
}
.add-win-page {
    width: 100%;
    height: 100%;
    background: url("~assets/img/hybrid/common/splash.png") no-repeat center top;
    background-color:#12b1eb;
    background-size: 100%;
    background-position-y: bottom;
    position: absolute;
    z-index: 10;
}

.add-win-page-new {
    width: 100%;
    height: 100%;
    background: url("~assets/img/hybrid/common/splash2.png") no-repeat center top;
    background-size: auto  100%;
    position: absolute;
    z-index: 10;
}

.add-win {
    display: block;
    background: url("~assets/img/hybrid/common/ts.png") no-repeat;
    width: 244px;
    height: 136px;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
    position: fixed;
    bottom: 0px;
    left: 50%;
    margin-left: -127px;
    //top: 70%;
}

.add-win img {
    display: inline-block;
    float: left;
}

.add-win div {
    display: inline-block;
    float: left;
}



.add-win-add-btn {
    margin-top: 66px;
    margin-left: 15px;
}

.add-win-line {
    margin-top: 60px;
}

.add-win-txt {
    margin-top: 65px;
    margin-left: 35px;
    margin-right: 10px;
    font-size: 14px;
}

.add-win-class {
    margin-top: 36px;
    margin-left: 15px;
    color: #3D9AF0;
}

.add-win-class span {
    font-size: 16px;
}

.withdraw_tx_coin {
    width:1.01rem;
    height:1.01rem;
    border-radius:0.51rem;
    border:0.03rem solid rgba(245,245,245,1);
    position: absolute;
    margin-left: 0.32rem;
    background: url("~assets/img/hybrid/common/touxiang.png") no-repeat center top;
    background-size: 100%;
}
.withdraw_tx_coin_content {
    height:1.01rem;
    position: absolute;
    margin-left: 1.33rem;
    font-size: 0.3rem;
    font-weight: normal;
    line-height: 0.54rem;
}

.add-gold-wd {
    font-size: 0.2rem;
    color: #FF9500;
    border-radius: 0.16rem;
    position: relative;
    line-height: 0.32rem;
    padding-right: 0.24rem;
    padding-left: 0.4rem;
    padding-top: 0.02rem;
    font-weight: bold;
    background: #FFF5E0;
    width:1.3rem;
    height:0.33rem;

    &::before {
        position: absolute;
        content: '';
        width: 0.33rem;
        height: 0.33rem;
        background: url('~assets/img/hybrid/common/xiaojinbi.png') no-repeat;
        background-size: 100%;
        left: 0;
    }
}

.add-gold-rmb {
    font-size: 0.2rem;
    color: #F35656;
    border-radius: 0.16rem;
    position: relative;
    line-height: 0.32rem;
    padding-right: 0.24rem;
    padding-left: 0.4rem;
    padding-top: 0.02rem;
    font-weight: bold;
    background: #FFEDED;
    width:1.3rem;
    height:0.33rem;
    margin-top: 0.05rem;

    &::before {
        position: absolute;
        content: '';
        width: 0.33rem;
        height: 0.33rem;
        background: url('~assets/img/hybrid/common/fenbi.png') no-repeat;
        background-size: 100%;
        left: 0;
    }
}


.tx_pic {
    float: right;
    margin-left: 2.8rem;
    background: url("~assets/img/hybrid/common/tixian.png") no-repeat center top;
    background-size: 100%;
    width:0.79rem;
    height:0.38rem;
    border-radius:0.33rem;
    position: absolute;
    font-size: 0.3rem;
    font-weight: normal;
    line-height: 0.54rem;
    margin-top: 0.5rem;

}
</style>
