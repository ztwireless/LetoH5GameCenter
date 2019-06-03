export default {
    data() {
        return {
            isLogin: false,
        }
    },

    mounted() {
        this.setMinHeight();
    },

    methods: {
        setMinHeight() {
            const root = this.$refs.root;

            if (root) {
                const height = root.offsetHeight;
                const screenHeight = document.documentElement.clientHeight;

                if (height < screenHeight) {
                    root.style.minHeight = screenHeight + 'px';
                }
            }
        },
    },
}
