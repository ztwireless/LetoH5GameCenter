# LETO GAMES

> 梦工厂游戏中心

## Build Setup

``` bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn run dev

# build for production and launch server
$ yarn run build
$ yarn start

# generate static project
$ yarn run generate
```

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).

## 自定义build

* 因为不同的渠道有不同的id, 并且可能有不同的游戏目录, 为了支持自动打包, 提供了一个`scripts/build.js`脚本用来支持自动打包, 使用方法为:

```
./node_modules/.bin/babel-node -- scripts/build.js --channel-id 333444 --game-root-url http://test
```

* channel-id为渠道id, game-root-url为游戏目录根url, 指定这两个参数就可以了, 生成后在dist目录即为该渠道的游戏中心文件
