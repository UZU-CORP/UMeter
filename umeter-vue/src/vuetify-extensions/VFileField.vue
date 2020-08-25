<template>
    <span>
        <v-text-field v-bind="$attrs" ref="textField" prepend-icon="attach_file" readonly @input="$event? null : clear()" v-model="filenames" :append-icon="filenames.length > 0 && !hideClear? 'close' : null" @click="showFileDialog" @click:prepend="showFileDialog" @click:append="clear" :color="color">
            <slot name="append-outer" slot="append-outer"/>
        </v-text-field>
    </span>
</template>

<script>
export default {
  name: 'VFileField',
  inheritAttrs: false,
  props: {
    multiple: Boolean,
    accept: String,
    hideClear: {
      type: Boolean,
      default: false
    },
    color: String,
    value: FileList
  },
  data () {
    return {
      fileList: [],
      fileField: null
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  methods: {
    showFileDialog () {
      this.fileField = document.createElement('input')
      this.fileField.type = 'file'
      this.fileField.multiple = this.multiple
      this.fileField.accept = this.accept
      this.fileField.click()
      this.fileField.addEventListener('change', this.onFileChange)
    },
    clear () {
      this.fileList = []
      this.$emit('change', this.fileList)
    },
    onFileChange (event) {
      this.fileList = event.target.files
      this.$emit('change', this.fileList)
    }
  },
  computed: {
    filenames () {
      const names = []
      for (let i = 0; i < this.fileList.length; i++) {
        names.push(this.fileList[i].name)
      }
      return names.join(', ')
    }
  }
}
</script>
