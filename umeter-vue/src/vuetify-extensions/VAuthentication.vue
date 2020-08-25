<template>
    <v-dialog v-model="show" width="300" persistent>
        <v-card>
            <v-card-title>
                <v-icon class="mr-2">mdi-account-question</v-icon>
                <span>Authentication</span>
                <v-spacer/>
                <v-btn icon @click="close">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <p>{{message}}</p>
                <v-form ref="authenticationForm" @submit.prevent="runAuthenticate">
                    <v-password-field v-model="password" label="Enter your password" :error-messages="passwordErrors" v-bind="$attrs"/>
                    <v-btn type="submit" rounded class="primary white--text" :loading="authenticating">
                        Authenticate
                    </v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import VPasswordField from "./VPasswordField";
import http from "../plugins/http";

export default {
  name: 'VAuthentication',
  inheritAttrs: true,

  props: {
    url: String
  },
  components: {
    VPasswordField
  },
  data () {
    return {
      show: false,
      password: '',
      passwordErrors: [],
      authenticating: false,
      message: '',
      resolve: null,
      reject: null
    }
  },
  methods: {
    close () {
      this.$refs.authenticationForm.reset()
      this.passwordErrors = []
      this.show = false
      this.$emit('close')
      this.reject('close')
    },
    authenticate (message = 'Please enter your password to proceed') {
      this.message = message
      this.show = true
      this.$emit('show')
      return this
    },
    then (resolve, reject = () => null) {
      this.resolve = resolve
      this.reject = reject
    },
    runAuthenticate () {
      if (this.$refs.authenticationForm.validate()) {
        const form = new FormData()
        form.append('password', this.password)
        this.authenticating = true
        this.passwordErrors = []
        http.request({
          url: this.url,
          method: 'POST',
          content: form
        }).then(response => {
          response = response.json()
          this.authenticating = false
          if (response.status) {
            this.close()
            this.resolve()
          } else {
            this.passwordErrors.push("Incorrect password")
            this.reject("Incorrect password")
          }
        }).catch(reason => {
          this.authenticating = false
          console.log(reason)
          this.reject(reason)
        })
      }
    }
  },
  mounted () {
    window.authenticate = this.authenticate
  }
}
</script>
