<template>
    <v-text-field v-bind="$attrs" :value="value" :hint="timeString.substring(19, timeString.lastIndexOf(')'))" persistent-hint readonly @click="showTimePicker = true">
        <v-menu v-model="showTimePicker" :close-on-content-click="false" :close-on-click="$vuetify.breakpoint.smAndUp" :offset-y="30" slot="prepend-inner">
            <v-icon slot="activator" slot-scope="{on}" v-on="on">mdi-av-timer</v-icon>
            <v-time-picker landscape width="300" v-bind="$attrs" v-model="value" @input="$emit('input', $event); showTimePicker = false" v-if="$vuetify.breakpoint.smAndUp"/>
            <v-dialog width="300" v-model="showTimePicker" v-if="$vuetify.breakpoint.xs">
                <v-time-picker width="300" v-bind="$attrs" v-model="value" @input="$emit('input', $event); showTimePicker = false"/>
            </v-dialog>
        </v-menu>
    </v-text-field>
</template>

<script>
export default {
  inheritAttrs: true,
  props: {
    value: String
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  data () {
    return {
      showTimePicker: false
    }
  },
  methods: {
    blur () {
      window.setTimeout(() => this.showTimePicker = false)
    },
  },
  computed: {
    timeString () {
      const value = new Date(`1970-1-1 ${this.value}`).toTimeString()
      if (value == 'Invalid Date') {
        return ''
      }
      return value
    }
  }
}
</script>
