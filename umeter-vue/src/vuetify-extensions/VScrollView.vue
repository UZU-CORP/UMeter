<template>
    <div ref="container">
        <v-container align-center v-if="filteredItems.length == 0 && !loading">
            <slot name="empty-state">
                <v-empty-state title="List Empty" icon="list"/>
            </slot>
        </v-container>
        <div ref="scrollView" v-else>
            <component :is="this.baseComponent" v-if="filteredItems.length > 0" v-bind="$attrs">
                <slot  v-for="(item, index) in filteredItems.slice(0, itemIndex)" :item="item" :index="index"/>
            </component>
            <center class="py-5">
                <slot name="load-more" :on="{click: () => loadItems(false)}" v-if="hasNextPage && (itemIndex >= filteredItems.length) && !loading">
                    <v-btn @click="loadItems(false)">Load More</v-btn>
                </slot>
                <v-progress-circular color="primary" indeterminate v-if="loading"/>
            </center>
        </div>
    </div>
</template>

<script>
import VEmptyState from '@/vuetify-extensions/VEmptyState'

export default {
  name: 'VScrollView',
  inheritAttrs: true,
  props: {
    loader: {
      type: [Function, Array],
      default: () => []
    },
    refresh: Boolean,
    useDocument: {
      type: Boolean,
      default: false
    },
    baseComponent: {
      type: String,
      default: () => "div"
    },
    rules: {
      type: Array,
      default: () => []
    },
    numberOfItemsPerView: {
      type: Number,
      default: 10
    }
  },
  data () {
    return {
      items: [],
      page: 1,
      loading: false,
      content: null,
      hasNextPage: false,
      itemIndex: 0
    }
  },
  components: {
    VEmptyState
  },
  computed: {
    filteredItems () {
      return this.items.filter((item, index) => {
        let flag = true
        for (const rule of this.rules) {
          flag = flag && (rule(item, index) === true)
        }
        return flag
      })
    }
  },
  methods: {
    loadMoreItems (event) {
      var target = this.useDocument? event.target.scrollingElement : event.target
      const scrollHeight = target.scrollHeight
      const clientHeight = target.clientHeight
      const scrollTop = target.scrollTop
      if (scrollHeight <= clientHeight + scrollTop && this.itemIndex < this.items.length) {
        this.itemIndex += this.numberOfItemsPerView
      }
    },
    loadItems (reload = false) {
      this.loading = true
      if (this.loader.constructor == [].constructor) {
        this.loading = false
        this.items = this.loader
        if (reload) {
          this.itemIndex = this.numberOfItemsPerView
        }
        return this.$nextTick()
      }
      return this.loader(this.page).then(response => {
        if (reload) {
          this.items = response.items || []
        } else {
          this.items.push(...(response.items || []))
        }
        this.page++
        this.loading = false
        this.hasNextPage = response.hasNextPage
      }).catch(() => {
        this.loading = false
        this.$emit('update:refresh', false)
      })
    }
  },
  mounted () {
    this.itemIndex = this.numberOfItemsPerView
    this.content = this.useDocument? document : this.$refs.container.parentElement
    this.content.addEventListener('scroll', this.loadMoreItems)
    this.loadItems()
  },
  beforeDestroy () {
    this.content.removeEventListener('scroll', this.loadMoreItems)
  },
  watch: {
    refresh (newValue) {
      if (newValue) {
        this.page = 1
        this.items = []
        this.loadItems(true).then(() => this.$emit('update:refresh', false)).catch(() => {
          this.loading = false
          this.$emit('update:refresh', false)
        })
        this.content.scrollTop = 0
      }
    }
  }
}
</script>
