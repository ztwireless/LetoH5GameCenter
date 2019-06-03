<template>
    <span @click="click">
        {{count}}
    </span>
</template>

<script>
export default {
    name: 'time-btn',
    props: {
        time: {
            default: 0,
            type: [Number, String]
        }
    },

    data() {
        return {
            timeCount: this.time
        }
    },

    mounted() {
        this.updateTime();
    },

    computed: {
        count() {
            if (this.timeCount <= 0) {
                return 0;
            }

            return this.sToHours(this.timeCount);
        },
    },

    methods: {
        sToHours(s) {
            var hh , mm , ss;

            ss = s % 60 ;
            s = Math.floor(s / 60) ;
            ss = ss >= 10 ? ss : '0' + ss;

            mm = s % 60 ;
            s = Math.floor(s / 60) ;
            mm = mm >= 10 ? mm : '0' + mm;

            hh = s % 60 ;
            s = Math.floor(s / 60) ;
            hh = hh >= 10 ? hh : '0' + hh;

            if (hh > 24) {
                return '23:59:59';
            } else if (hh < 1) {
                return mm + ':' + ss;
            } else {
                return hh + ':' + mm + ':' + ss;
            }
        },

        click() {
            this.$emit('ok');
        },

        updateTime() {
            clearInterval(this.timer);

            this.timer = setInterval(() => {
                this.timeCount -= 1;
                if (this.timeCount <= 0) {
                    clearInterval(this.timer);
                    this.$emit('end');
                }
            }, 1000);
        }
    },

    watch: {
        time(val, old) {
            this.timeCount = val;
        }
    },

    destroyed() {
        clearInterval(this.timer);
    },
}
</script>
