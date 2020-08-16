<template>
    <v-container v-bind="$attrs" align-center>
        <center>
            <v-icon :size="iconSize" class="icon" :color="iconColor" v-if="icon">{{icon}}</v-icon>
            <p class="title font-weight-bold" :class="{'white--text': dark, 'black--text': light}" v-if="title">{{title}}</p>
            <p class="subheading" v-if="description" :class="{'white--text': dark, 'black--text': light}">{{description}}</p>
            <div>
                <slot></slot>
            </div>
        </center>
    </v-container>
</template>

<script>
export default {
  name: 'VEmptyState',
  inheritAttrs: false,
  props: {
    icon: String,
    title: String,
    description: String,
    light: Boolean,
    dark: Boolean,
    iconSize: {
      type: String,
      default: '150'
    },
    iconColor: {
      type: String,
      default: ''
    }
  }

}
</script>
