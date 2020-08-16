<template>
    <v-container grid-list-xl v-if="loaded">
        <v-layout wrap row v-resize="onResize">
            <v-flex :class="{fixed : $vuetify.breakpoint.smAndUp}" class="pb-0" v-show="$vuetify.breakpoint.smAndUp || currentView == 'list'" ref="flex">
                <template>
                    <slot name="list-toolbar"/>
                </template>
                <v-sheet id="containerVList" :max-height="maxHeight" class="transparent">
                    <v-scroll-view ref="scrollView" :loader="tweakedLoader" :refresh="refresh" @update:refresh="$emit('update:refresh', $event)" :rules="rules">
                        <template v-slot="{item, index}">
                            <v-sheet :class="`${item.selected? selectedClass : ''}`" class="transparent">
                                <slot name="list" :on="{click: () => select(item, index, true)}" :item="item" :index="index"/>
                            </v-sheet>
                        </template>
                        <template v-slot:empty-state>
                            <slot name="empty-state"/>
                        </template>
                        <template v-slot:load-more>
                            <slot name="load-more"/>
                        </template>
                    </v-scroll-view>
                </v-sheet>
            </v-flex>
            <v-flex xs12 sm5 md4 v-show="$vuetify.breakpoint.smAndUp" ref="helperFlex" class="pa-0"/>
            <v-flex xs12 sm7 md8 v-show="$vuetify.breakpoint.smAndUp">
                <v-toolbar dense dark color="primary" v-if="$scopedSlots['details:toolbar']">
                    <slot name="details:toolbar" :item="selectedItem" :index="selectedIndex"/>
                </v-toolbar>
                <slot name="details" :item="selectedItem" :index="selectedIndex" />
            </v-flex>
        </v-layout>
        <v-dialog fullscreen :value="$vuetify.breakpoint.xs && currentView == 'details'" lazy>
          <v-card>
            <v-btn icon @click="showListView" style="float: right" class="mr-3 mt-3">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-card-text>
              <slot name="details" :item="selectedItem" :index="selectedIndex"/>
            </v-card-text>
          </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import VScrollView from '@/vuetify-extensions/VScrollView'

export default {
  props: {
    loader: {
      type: [Function, Array],
      default: () => []
    },
    refresh: Boolean,
    rules: {
      type: Array,
      default: () => []
    },
    maxHeight: {
      type: [String, Number],
      default: '60vh'
    },
    selectedClass: {
      type: [Array, Object],
      default: () => ['primary--text']
    }
  },
  components: {
    VScrollView
  },
  data () {
    return {
      currentView: 'list',
      selectedIndex: -1,
      selectedItem: {},
      tweakedLoader: [],
      loaded: false,
      initial: true,
    }
  },
  methods: {
    tweakLoader () {
      if (this.loader.constructor == Function) {
        return (page) => this.loader(page).then(data => {
          if (data.items.length > 0 && this.initial) {
            this.select(data.items[0], 0)
            this.initial = false
          }
          return data
        })
      } else {
        if (this.loader.length > 0) {
          this.select(this.loader[0], 0)
        }
        return () => new Promise((resolve, reject) => resolve({items: this.loader, hasNextPage: false}));
      }
    },
    onResize () {
      this.$refs.flex.style.width = `${this.$refs.helperFlex.clientWidth}px`
    },
    showListView () {
      this.currentView = 'list'
      this.$emit('change-view', 'list')
    },
    showDetailsView () {
      this.currentView = 'details'
      this.$emit('change-view', 'details')
    },
    select (item, index, changeView = false) {
      this.selectedItem.selected = false
      this.selectedItem = {}
      window.setTimeout(() => this.selectedItem = item, 50)
      this.$vuetify.goTo(0)
      this.selectedIndex = index
      if (changeView) {          
        this.showDetailsView()
      }
      this.$emit('selected', { item, index })
      this.$emit('change-view', 'details')
      item.selected = true
    }
  },
  mounted () {
    this.tweakedLoader = this.tweakLoader()
    this.loaded = true
  },
  watch: {
    refresh (newValue) {
      if (newValue) {
        if(this.$refs.scrollView.items.length > 0)
          this.select(this.$refs.scrollView.items[0], 0)
        this.initial = true
        this.currentView = 'list'
        this.$refs.scrollView.content.scrollTop = 0
        this.$vuetify.goTo(0)
      }
    },
    loaded (newValue) {
      if (newValue) {
        this.$nextTick().then(this.onResize)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
    .fixed{
        position: fixed;
    }
    #containerVList, #containerVDetails{
        overflow-y: auto;
        border-radius: 0
    }
    .item{
        cursor: pointer;
    }
</style>
