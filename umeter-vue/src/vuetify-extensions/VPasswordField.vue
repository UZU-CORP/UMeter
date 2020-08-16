<template>
    <v-text-field
        v-bind="$attrs"
        :value="value"
        @input="$emit('input', $event)"
        :append-icon="visibilityIcon? (!visibility? 'mdi mdi-eye-outline': 'mdi mdi-eye-off-outline') : null"
        @click:append="visibility = !visibility" :type="!visibility? 'password': 'text'"
    />
</template>

<script>
export default {
  name: 'VPasswordField',
  inheritAttrs: false,
  props: {
    value: String,
    visibilityIcon: {
      type: Boolean,
      default: true
    }
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  data () {
    return {
      visibility: false
    }
  },
  watch: {
    visibility (newValue) {
      this.$emit('visibility', newValue)
    }
  }
}
</script>
