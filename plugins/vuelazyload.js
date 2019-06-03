import Vue from 'vue'
import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload, {
    error: 'http://m.pezy.cn/images/error.png',
    loading: 'http://m.pezy.cn/images/loading.png'
});
