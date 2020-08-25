<template>
    <v-snackbar v-model="showing" v-bind="$attrs" multi-line :timeout="options.loading? 0 : 6000" :left="options.left" :right="options.right" :top="options.top" :bottom="options.bottom">
        <span class="mr-3">
            <v-progress-circular :color="options.iconColor" indeterminate v-if="options.loading"/>
            <v-icon  :color="options.iconColor" v-else>{{options.icon}}</v-icon>
        </span>
        {{options.message}}
        <v-spacer/>
        <v-btn icon @click="showing = false" v-if="!options.loading">
            <v-icon color="white">mdi mdi-close</v-icon>
        </v-btn>
    </v-snackbar>
</template>

<script>

export default {
  inheritAttrs: false,
  data () {
    return {
      showing: false,
      options: {},
      showTimeout: null
    }
  },
  methods: {
    toast (value) {
      if (value == false){
        this.showing = false;
        clearTimeout(this.showTimeout);
      } else if (this.showing) {
        this.showing = false,
        this.showTimeout = setTimeout(() => {
          this.showing = true
          this.options = value
        }, 400)
      } else {
        this.showing = true
        this.options = value
      }
    }
  },
  created () {
    window.toast = this.toast
  }
}
</script>
