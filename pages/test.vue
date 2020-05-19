<template>
    <div>
        <div id="test_feed_container">
        </div>
        <div style="background-color: #5c696d">
            <a @click="showVideo" class="button">显示视频广告</a><br/><br/>
            <a @click="feedAd()" class="button">显示信息流广告</a>
            <a @click="feedAdHide()" class="button">隐藏信息流广告</a>
            <a @click="feedAdDestroy()" class="button">销毁信息流广告</a><br/><br/>
        </div>
    </div>
</template>

<script>
	export default {
		name: "test.vue",
        methods: {
			showVideo() {
                var v = mgc.createRewardedVideoAd()
                v.onClose(res => {
                    console.log(`video closed!! ${JSON.stringify(res)}`)
                    v.destroy()
                })
                v.onError(res => {
                    console.log(`video can not be played`)
                    v.destroy()
                })
                v.show()
            },
			feedAd() {
				if(window.__feed_ad) {
					window.__feed_ad.destroy()
					window.__feed_ad = null
                }
                if(!window.__feed_ad) {
                    window.__feed_ad = mgc.createFeedAd({
                        container: document.getElementById('test_feed_container')
                    })
                    window.__feed_ad.onLoad(res => {
                        window.__feed_ad.show()
                    })
                    window.__feed_ad.load()
                } else {
                    window.__feed_ad.show()
                }
            },

            feedAdHide() {
                if(window.__feed_ad) {
                    window.__feed_ad.hide()
                }
            },

            feedAdDestroy() {
                if(window.__feed_ad) {
                    window.__feed_ad.destroy()
                    window.__feed_ad = null
                }
            }
        },
        mounted() {
			mgc.setChannelId('1001290')
		}
	}
</script>

<style scoped>
    #test_feed_container {
        position: absolute;left: 10px;right: 10px;top: 20px;display: block;
    }

    .button {
        font: bold 20px Arial;
        text-decoration: none;
        background-color: #EEEEEE;
        color: #333333;
        padding: 2px 6px 2px 6px;
        border-top: 1px solid #CCCCCC;
        border-right: 1px solid #333333;
        border-bottom: 1px solid #333333;
        border-left: 1px solid #CCCCCC;
    }
</style>
