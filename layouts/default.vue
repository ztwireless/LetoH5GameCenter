<template>
  <div class="mobile">
    <nuxt />
  </div>
</template>
<script>
import rem from '../plugins/rem.js';

let baidu = `
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?7a75371194005043a1d382724695b914";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();
`;

export default {
    name: 'mobile',
    head() {
        return {
            script: [
                {
                    innerHTML: rem(),
                    type: 'text/javascript',
                },
                // {
                //     src: 'http://sdk.talkingdata.com/app/h5/v1?appid=AE88C73D0AA84D6FBAD7EB8A5EA0584B&vn=v1.0&vc=1.0',
                //     type: 'text/javascript',
                // },
                {
                    innerHTML: baidu,
                    type: 'text/javascript',
                },
            ],
            __dangerouslyDisableSanitizers: ['script']
        }
    },
}
</script>

<style lang="less">
@import '~assets/less/normalize.less';
@import '~assets/less/app.less';

#__nuxt,
#__layout,
.mobile {
    // height: 100%;
    // overflow-x: hidden;
}
</style>
