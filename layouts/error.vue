<template>
    <section class="container">
        <template v-if="error.statusCode === 404">
            <img src="~assets/img/logo.png" class="logo" />
            <h1 class="title">404</h1>
            <p class="info">世界上最远的距离，是我装了亿刻APP，你却没有安装，<nuxt-link to="/">立即下载</nuxt-link></p>
        </template>
        <template v-else>
            <h1 class="title">
                {{error.statusCode}}
            </h1>
            <h2 class="info">
                {{error.message}}
            </h2>
        </template>
    </section>
</template>
<script>
export default {
    head() {
        return {
            title: '404'
        }
    },
    props: ['error'],
}
</script>

<style scoped lang="less">
.title {
    font-size: 2rem;
    font-weight: normal;
    text-align: center;
    margin: 0 0 .2rem 0;
}

.info {
    font-weight: 300;
    color: #5c696d;
    margin: 0;
    font-size: .28rem;
    padding: 0 .4rem;
    line-height: .4rem;

    a {
        color: #ff4940;
    }
}

.logo {
    display: block;
    width: 2rem;
    height: 2rem;
    margin: .4rem auto;
    border-radius: 100%;
}
</style>
