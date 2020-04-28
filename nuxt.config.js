let config = require('./config');
let webpack = require('webpack');
let dayjs = require('dayjs');

// router base, 如果相对路径有变化时需要设置
const routerBase = ''

module.exports = {
    mode: 'spa',
    /*
     ** Headers of the page
     */
    head: {
        titleTemplate: '%s',
        meta: [
            {
                charset: 'utf-8'
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1, maximum-scale=1,user-scalable=no'
            },
            // iphone 长数字识别为手机号，关闭
            {
                name: 'format-detection',
                content: 'telephone=no',
            },
            {
                name: 'version',
                content: config.version,
                time: dayjs().format('YYYY-MM-DD HH:mm:ss SSS [Z] A'), // 展示
            }
        ],
        link: [{
            rel: 'icon',
            type: 'image/x-icon',
            href: '/favicon.ico'
        },
            {
                rel: 'apple-touch-icon',
                href: '/favicon.ico'
            },
            {
                rel: 'apple-touch-startup-image',
                href: '/favicon.ico'
            }],
        // html head 中创建 script 标签
        script: [
            {
                innerHTML: '\t\tvar __wxAppData = {}\n' +
                    '\t\tvar __wxRoute\n' +
                    '\t\tvar __wxRouteBegin\n' +
                    '\t\tvar __eval = eval\n' +
                    '\t\tvar global = {}\n',
                type: 'text/javascript',
                charset: 'utf-8'
            },
            {
                src: `${routerBase}/static/__leto__/service-config.js`,
                type: 'text/javascript',
                charset: 'utf-8'
            },
            {
                src: `${routerBase}/static/__leto__/config.js`,
                type: 'text/javascript',
                charset: 'utf-8'
            },
            {
                src: `${routerBase}/static/framework/view.js`,
                type: 'text/javascript',
                charset: 'utf-8'
            },
            {
                src: `${routerBase}/static/__leto__/app-service.js`,
                type: 'text/javascript',
                charset: 'utf-8'
            }
        ],
        // // 不对<script>标签中内容做转义处理
        // __dangerouslyDisableSanitizers: ['script'],
    },
    router: {
        base: routerBase
    },

    server: {
        port: 3000, // default: 3000
        host: '0.0.0.0', // default: localhost,
        timing: {
            total: true
        }
    },
    /*
     ** Global CSS
     */
    css: [
        'swiper/dist/css/swiper.css'
    ],
    /*
     ** Customize the progress-bar color
     */
    loading: {
        color: '#E0E0E0'
    },

    loadingIndicator: {
        name: 'three-bounce',
        color: '#3B8070',
        background: 'white'
    },

    plugins: [
        {
            src: '~plugins/day.js', ssr: false,
        },
        {
            src: '~plugins/alloylever.js', ssr: false,
        },
        {
            src: '~plugins/callupapp.js', ssr: false,
        },
        {
            src: '~plugins/lazyload.js', ssr: false,
        },
        {
            src: '~plugins/cookie.js', ssr: false,
        },
        {
            src: '~plugins/wechatsdk.js', ssr: false,
        },
        {
            src: '~plugins/clipboard.js', ssr: false,
        },
        {
            src: '~/plugins/qrcode.js', ssr: false,
        },
        {
            src: '~/plugins/ydui.js', ssr: false,
        },
        {
            src: '~/plugins/fingerprint.js', ssr: false,
        },
        {
            src:'~/plugins/Swiper.js', ssr: false,
        },
        //图片懒加载
        {
            src: '~/plugins/vuelazyload.js',ssr:false,
        },
        {
            src: '~/plugins/base64', ssr: false
        },
        {
            src: '~plugins/toast.js', ssr: false,
        }
    ],

    performance: {
        preload: false,
        prefetch: false,
    },

    /*
     ** Build configuration
     */
    build: {

        babel: {
            exclude: /\/node_modules/,
            // presets: ['@nuxt/babel-preset-app']
            // presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-syntax-dynamic-import', '@babel/plugin-transform-runtime']
        },

        // vendor: ['babel-polyfill'],

        publicPath: config.cdn,

        extractCSS: true,
        // extractCSS: {allChunks: true},

        // 自定义打包文件名
        filenames: {
            app: ({
                isDev
            }) => isDev ? '[name].js' : 'app-[id].[chunkhash].js',
            chunk: ({
                isDev
            }) => isDev ? '[name].js' : 'chunk-[id].[chunkhash].js',
            css: ({
                isDev
            }) => isDev ? '[name].css' : 'css-[id].[contenthash].css',
            img: ({
                isDev
            }) => isDev ? '[path][name].[ext]' : 'img/[hash:7].[ext]',
            font: ({
                isDev
            }) => isDev ? '[path][name].[ext]' : 'fonts/[hash:7].[ext]',
            video: ({
                isDev
            }) => isDev ? '[path][name].[ext]' : 'videos/[hash:7].[ext]'
        },

        /*
         ** Run ESLINT on save
         */
        extend(conf, ctx) {
            // if (ctx.isClient) {
            //     conf.plugins
            //         .push(new webpack.BannerPlugin({
            //             banner: `m.pezy.cn ${config.version} | by pezy.cn Team  (c) ${new Date().getFullYear()
            //             } | ${dayjs().format('YYYY-MM-DD HH:mm:ss SSS [Z] A')}`
            //         }))
            // }
        }
    }
}
