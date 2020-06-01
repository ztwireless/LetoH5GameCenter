<template>

    <StickyBox :top="top"  class="box">
        <div style="width: 100vw" class="slot stickyAd" ref="stickyAd" >  </div>
    </StickyBox>

</template>

<script>
    import StickyBox from '~/components/sticky-box';
    export default {
        name: "StickyAd",

        components:{
            StickyBox,
        },
        props: {
            // top: {
            //     type: [String],
            //     default: '0px',
            // },
        },

        data() {
            return {
                top:'0px'
            }
        },

        //创建的时候添加一个广告
        mounted() {

            this.showStickyAd()
            //获取高度
          // let height =  document.getElementById("div").offsetHeight
            try{
                let dom=document.getElementById("header")||document.getElementById("header_mini")

                console.log(dom)
                let height = dom.offsetHeight
                this.top=height+'px'
            }catch (e) {
                console.log('height err',e)
                this.top=0+'px'
            }
        },

        methods:{

            //吸顶的信息流广告
            showStickyAd(){
                //计算stickyAdTop值
                try{
                    var heightCss = this.$refs.header.offsetHeight;
                    this.stickyAdTop=heightCss+'px'
                }catch (e) {
                    this.stickyAdTop='0px'
                }

                var dom=this.$refs.stickyAd
                var that=this

                var ad = mgc.createFeedAd({
                    container:dom,
                    hide_button:true,
                    style: { // 应用于图片的css样式
                        //"height": "30vh",
                        "width":"100vw",
                        //"max-height": "280px"
                    }
                })

                ad.onLoad(()=> {
                    dom.style.paddingBottom = "20px"
                    console.log('压屏信息流加载成功')
                    ad.show()
                    // report
                    if(window.mgc.reportH5GameCenterTodayRecommendFeedAdExpose) {
                        window.mgc.reportH5GameCenterTodayRecommendFeedAdExpose()
                    }
                })

                ad.onError(()=>{
                    console.log('压屏信息流加载失败')
                    if(this.$refs.feedLayer==true)this.$refs.feedLayer.style.display = 'none'
                    if(this.$refs.errorLayer==true)this.$refs.errorLayer.style.display = 'block'
                })
                ad.load()
            },


        }
    }

</script>

<style scoped>

</style>
