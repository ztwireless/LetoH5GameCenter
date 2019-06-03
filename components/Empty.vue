<template>
    <div class="empty">
        <div class="mask" @click="close"></div>
        <div class="body">
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    name: 'empty',
    methods: {
        close() {
            this.$emit('close');
        }
    }
}
</script>

<style scoped lang="less">
@import '~assets/less/Mixins.less';

.empty {
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
    border-radius: .24rem;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
}

</style>
