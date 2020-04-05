<template>
  <div class="mobile">
    <nuxt />
  </div>
</template>
<script>
import rem from '../plugins/rem.js';

export default {
    name: 'hybrid',
    head() {
        return {
            script: [
                {
                    innerHTML: rem(),
                    type: 'text/javascript',
                }
            ],
            __dangerouslyDisableSanitizers: ['script']
        }
    },
}
</script>

<style lang="less">
@import '~assets/less/normalize.less';
@import '~assets/less/pluginupd.less';
@import '~assets/less/app.less';

#__nuxt,
#__layout,
.mobile {
    // height: 100%;
    // overflow-x: hidden;

    // min-height: 100%;
    height: 100%;
}
</style>
