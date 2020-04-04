import Vue from 'vue'
import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload, {
    error: require('../assets/img/error.png'),
    loading: require('../assets/img/loading.png')
});
