<template>
	<span ref="span">{{countValue}}</span>
</template>

<script>
export default {
  props: {
    value: Number,
    step: {
      default: 1,
      type: Number
    }
  },
  data () {
    return {
      countValue: 0
    }
  },
  methods: {
    update () {
      if (this.value > this.countValue) {
        this.countValue += this.step
        setTimeout(this.update, 1)
      }
    },
    updater () {
      const boundingRect = this.$refs.span.getBoundingClientRect()
      if (document.documentElement.clientHeight - boundingRect.y > 100) {
        this.update()
        document.removeEventListener('scroll', this.updater)
      }
    }
  },
  mounted () {
    document.addEventListener('scroll', this.updater)
  },
  destroyed () {
    document.removeEventListener('scroll', this.updater)
  }
}
</script>
