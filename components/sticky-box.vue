<!--sticky组件-->
<template>
  <!--盒子容器-->
  <section ref="$box" class="c-sticky-box" :style="boxStyle">
    <!--内容容器-->
    <div ref="$content" class="content" :style="contentStyle">
      <slot></slot>
    </div>
  </section>
</template>

<script>
    /*
    * 注意：  该组件在cssSupport返回为false的时候，sticky是相对于整个窗口做定位的，而不是标准的sticky 那样，相对于父级元素
    * */



export default {
  props: {
    top: {
      type: [String],
      default: 'unset',
    },
    left: {
      type: [String],
      default: 'unset',
    },
  },

  data() {
    return {
      boxStyle: {
        position: 'static',
        top: 0,
        left: 0,
        width: 'auto', // 占位，为了形成数据绑定
        height: 'auto',
          zIndex:1000
      },
      contentStyle: {
        position: 'static',
        top: 0,
        left: 0,
        width: 'auto',
        height: 'auto',
          zIndex:1000
      },
      isFixedX: false, // 是否已经设置为fixed布局，用于优化性能，防止多次设置
      isFixedY: false, // 是否已经设置为fixed布局，用于优化性能，防止多次设置
      isSupport: this.cssSupport('position', 'sticky'),
      // isSupport: false,
    }
  },

  mounted() {
    if (!this.isSupport) { // 不支持sticky
      this.getContentSize() // 获取内容宽高
      this.scrollHandler() // 主动触发一次位置设置操作
      window.addEventListener('resize', this.onResize)
      window.addEventListener('scroll', this.scrollHandler, true)
    } else {
      this.boxStyle = {
        position: 'sticky',
        top: this.top,
        left: this.left,
      }
    }
  },

  beforeDestroy() {
    if (!this.isSupport) {
      window.removeEventListener('resize', this.onResize)
      window.removeEventListener('scroll', this.scrollHandler, true)
    }
  },

  methods: {
    // 判断是否支持某样式的函数
    cssSupport(attr, value) {
      // let element = document.createElement('div')
      // if (attr in element.style) {
      //   element.style[attr] = value
      //   return element.style[attr] === value
      // } else {
      //   return false
      // }
        return false
    },

    // 获取dom数据
    getContentSize() {
      // 获取内容容器宽高信息
      const style = window.getComputedStyle(this.$refs.$content)

      // 设置盒子容器的宽高，为了后续占位
      this.boxStyle.width = style.width
      // this.boxStyle.height = style.height
        this.boxStyle.height = 'auto'
    },

    // 页面缩放重置大小时，重新计算其位置
    onResize() {
      const { $box } = this.$refs
      const { contentStyle } = this
      const boxTop = $box.getBoundingClientRect().top
      const boxLeft = $box.getBoundingClientRect().left

      if (contentStyle.position === 'fixed') {
        contentStyle.top = this.top === 'unset' ? `${boxTop}px` : this.top
        contentStyle.left = this.left === 'unset' ? `${boxLeft}px` : this.left
      }
    },

    scrollHandler() {
      const { $content, $box } = this.$refs
      const { contentStyle } = this
      const boxTop = $box.getBoundingClientRect().top
      const boxLeft = $box.getBoundingClientRect().left
      const contentTop = $content.getBoundingClientRect().top
      const contentLeft = $content.getBoundingClientRect().left

      if (this.top !== 'unset') {
        if (boxTop > parseInt(this.top) && this.isFixedY) {
          this.isFixedY = false
          contentStyle.position = 'static'
        } else if (boxTop < parseInt(this.top) && !this.isFixedY) {
          this.isFixedY = true
          contentStyle.position = 'fixed'
          this.onResize()
        }

        // 当位置距左位置不对时，重新设置fixed对象left的值，防止左右滚动位置不对问题
        if (contentLeft !== boxLeft && this.left === 'unset') {
          this.onResize()
        }
      }

      if (this.left !== 'unset') {
        if (boxLeft > parseInt(this.left) && this.isFixedX) {
          this.isFixedX = false
          contentStyle.position = 'static'
        } else if (boxLeft < parseInt(this.left) && !this.isFixedX) {
          this.isFixedX = true
          contentStyle.position = 'fixed'
          this.onResize()
        }

        // 当位置距左位置不对时，重新设置fixed对象left的值，防止左右滚动位置不对问题
        if (contentTop !== boxTop && this.top === 'unset') {
          this.onResize()
        }
      }
    },
  },

}
</script>
