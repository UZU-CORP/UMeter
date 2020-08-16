<template>
    <v-dialog v-model="show" width="300" persistent>
        <v-dialog-content>
            <v-card :dark="dark" :light="light">

                <v-card-title>
                    <v-icon class="mr-2">{{icon}}</v-icon> <span>{{title}}</span>
                    <v-spacer/>
                    <v-btn icon @click="close">
                        <v-icon>mdi mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <p class="font-weight-bold">{{message}}</p>
                    <v-card-actions>
                        <v-btn depressed rounded class="primary font-weight-bold text-capitalize" :small="small" @click="runConfirm(true)">{{yes}}</v-btn>
                        <v-btn depressed rounded :small="small" class="secondary font-weight-bold text-capitalize" @click="runConfirm(false)">{{no}}</v-btn>
                    </v-card-actions>
                </v-card-text>
            </v-card>
        </v-dialog-content>
    </v-dialog>
</template>

<script>
export default {
  name: 'VConfirmation',
  props: {
    dark: Boolean,
    light: Boolean,
    small: Boolean
  },
  data () {
    return {
      show: false,
      resolve: () => null,
      reject: () => null,
      message: '',
      yes: 'yes',
      no: 'no',
      icon: 'mdi-information',
      title: 'Confirmation'
    }
  },
  methods: {
    close () {
      this.show = false
      this.message = "";
      this.yes = "yes";
      this.no = "no";
      this.icon = "mdi-information";
      this.title = "Confirmation";
      this.$emit('close')
      this.resolve(null)
    },
    confirm (setup = {}) {
      this.message = setup.message || 'Please confirm this action'
      this.yes = setup.yes || this.yes
      this.no = setup.no || this.no
      this.icon = setup.icon || this.icon
      this.title = setup.title || this.title
      this.show = true
      this.$emit('show')
      return this
    },
    then (resolve) {
      this.resolve = resolve
    },
    runConfirm (value) {
      this.show = false
      this.$emit('close')
      this.resolve(value)
    }
  },
  mounted () {
    window.confirm = this.confirm
  }
}
</script>
