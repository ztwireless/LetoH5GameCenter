<template>
    <transition name="toast-from-bottom">
        <div class="toast toast-bottom" v-show="visible" role="toast">
            <slot><div>{{text}}</div></slot>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'toast',
    data() {
        return {
            text: '', // 显示文案
            onClose: null, // 关闭回调函数

            visible: false, // 显示隐藏
            timer: null, // 倒计时实例
            duration: 2000, // 持续时间
            closed: false, // 状态
        }
    },
    watch: {
        closed(newVal) {
            if (newVal) {
                this.visible = false;
                this.$el.addEventListener('transitionend', this.destroyElement, false);
            }
        }
    },

    methods: {
        destroyElement() {
            this.$el.removeEventListener('transitionend', this.destroyElement, false);
            this.$destroy(true);
            this.$el.parentNode.removeChild(this.$el);
        },

        close() {
            this.closed = true;
            if (typeof this.onClose === 'function') {
                this.onClose(this);
            }
        },

        start() {
            if (this.duration > 0) {
                this.timer = setTimeout(() => {
                    if (!this.closed) {
                        this.close();
                    }
                }, this.duration);
            }
        },

        clear() {
            clearTimeout(this.timer);
        }
    },

    mounted() {
        this.start();
    },


}
</script>

<style lang="less" scoped>
.toast {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    line-height: .4rem;
    border-radius: .66rem;
    padding: .15rem .5rem;
    background: rgba(0, 0, 0, .4);
    color: #fff;
    font-size: .26rem;
    z-index: 11000;
}

.toast-bottom {
    top: auto;
    bottom: 60px;
    transform: translateX(-50%);
}

.toast-from-bottom-enter,
.toast-from-bottom-leave-active {
    opacity: 0;
    transform: translateX(-50%) translateY(100%)!important;
}

.toast-from-bottom-enter-active,
.toast-from-bottom-leave-active {
    transition: all 400ms cubic-bezier(.36, .66, .04, 1);
}
</style>
