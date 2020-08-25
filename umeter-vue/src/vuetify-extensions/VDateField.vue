<template>
    <v-text-field v-bind="$attrs" :value="dateString" readonly @click="showDatePicker = true">
        <v-menu v-model="showDatePicker" :close-on-content-click="false" :close-on-click="$vuetify.breakpoint.smAndUp" :offset-y="30" slot="prepend-inner">
            <v-icon slot="activator" slot-scope="{on}" v-on="on">event</v-icon>
            <v-date-picker landscape width="300" v-bind="$attrs" v-model="value" @input="$emit('input', $event); showDatePicker = false" v-if="$vuetify.breakpoint.smAndUp"/>
            <v-dialog width="300" v-model="showDatePicker" v-if="$vuetify.breakpoint.xs">
                <v-date-picker width="300" v-bind="$attrs" v-model="value" @input="$emit('input', $event); showDatePicker = false"/>
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
      showDatePicker: false
    }
  },
  methods: {
    blur () {
      window.setTimeout(() => this.showDatePicker = false)
    },
  },
  computed: {
    dateString () {
      const value = new Date(this.value).toDateString()
      if (value == 'Invalid Date') {
        return ''
      }
      return value
    }
  }
}
</script>
