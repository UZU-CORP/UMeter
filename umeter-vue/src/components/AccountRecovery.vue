<template>
    <div>
        <v-toolbar :dark="toolbarDark" color="primary" :app="app">
            <v-btn icon @click="$emit('back')">
                <v-icon>keyboard_backspace</v-icon>
            </v-btn>
            <span class="subheading">Account Recovery</span>
        </v-toolbar>
        <v-stepper id="vertical-steppers" vertical v-model="activeStep" :dark="dark" class="elevation-0">
            <v-stepper-step step="1" @click="restart" :complete="activeStep > 1">
                {{activeStep > 1? "Click here to restart" : "Email"}}
                <small>{{activeStep > 1? "" : "Please enter your Email"}}</small>
            </v-stepper-step>
            <v-stepper-content step="1">
                <v-form ref="sendVerificationCodeForm" @submit.prevent="sendVerificationCode()">
                    <v-text-field :disabled="activeStep != 1" label="Enter email" :rules="[requiredRule]" :error-messages="usernameErrors"  v-model="username" prepend-icon="mdi mdi-email-outline" :dark="dark" :light="light" :color="color">
                        <v-progress-circular color="primary" slot="append-outer" indeterminate v-if="findingAdmin" width="1"/>
                    </v-text-field>
                    <v-btn icon :loading="sending" type="submit" class="primary white--text">
                        <v-icon>mdi mdi-arrow-right-circle-outline</v-icon>
                    </v-btn>
                </v-form>
            </v-stepper-content>
            <v-stepper-step step="2" :complete="activeStep > 2">
                Verify Account
                <small>Please enter verification code</small>
            </v-stepper-step>
            <v-stepper-content step="2">
                <v-form ref="verificationForm" @submit.prevent="verify">
                    <v-text-field :disabled="activeStep != 2" label="Enter verification code" :rules="[requiredRule]" :error-messages="verificationErrors" v-model="code" prepend-icon="mdi mdi-pound" :dark="dark" :light="light" :color="color"/>
                    <v-btn class="primary mr-2" :loading="verifying" :disabled="activeStep != 2" type="submit">verify</v-btn>
                    <v-btn :loading="sending" @click="sendVerificationCode('resend')">Resend code</v-btn>
                </v-form>
            </v-stepper-content>
            <v-stepper-step step="3" :complete="activeStep > 3">
                Reset Password
                <small>Create a new password</small>
            </v-stepper-step>
            <v-stepper-content step="3">
                <v-form ref="resetPasswordForm" @submit.prevent="resetPassword">
                    <v-password-field :disabled="activeStep != 3" label="Enter new password" :rules="[requiredLengthRule(6)]" :error-messages="newPasswordErrors" v-model="newPassword" prepend-icon="lock_outline" :dark="dark" :light="light" :color="color"/>
                    <v-btn icon class="primary white--text" :loading="verifying" :disabled="activeStep != 3" type="submit">
                        <v-icon>mdi mdi-arrow-right-circle-outline</v-icon>
                    </v-btn>
                </v-form>
            </v-stepper-content>
            <v-stepper-step step="4" :complete="activeStep > 4">
                Done
            </v-stepper-step>
            <v-stepper-content step="4">
                <p>Account recovery was completed succesfully. What would you like to do next?</p>
                <v-btn class="primary mr-2" @click="signIn" :loading="signingIn">sign me in</v-btn>
                <v-btn @click="$emit('back')">close</v-btn>
            </v-stepper-content>
        </v-stepper>
        <v-snackbar bottom :right="$vuetify.breakpoint.smAndUp" v-model="showSnackbar">
            <v-icon :color="snackbarMessage.iconColor">{{snackbarMessage.icon}}</v-icon>
            <span class="ml-2">{{snackbarMessage.message}}</span>
            <v-spacer/>
            <v-btn icon @click="showSnackbar = false">
                <v-icon>mdi mdi-close</v-icon>
            </v-btn>
        </v-snackbar>
    </div>
</template>

<script>
import requiredRule from "@/rules/requiredRule"
import requiredLengthRule from "@/rules/requiredLengthRule"
import VPasswordField from "@/vuetify-extensions/VPasswordField"
import http from "../plugins/http";

export default {
    props: {
        dark: Boolean,
        toolbarDark: Boolean,
        light: Boolean,
        color: String,
        app: Boolean,
        path: String,
    },
    components: {
        VPasswordField
    },
    data(){
        return {
            activeStep: 1,
            username: "",
            code: "",
            newPassword: "",

            sending: false,
            verifying: false,
            resetting: false,
            signingIn: false,

            usernameErrors: [],
            verificationErrors: [],
            newPasswordErrors: [],

            snackbarMessage: {},
            showSnackbar: false
        }
    },
    methods: {
        sendVerificationCode(mode="send"){
            if(this.$refs.sendVerificationCodeForm.validate()){
                this.sending = true;
                this.usernameErrors = []
                var content = new FormData()
                content.append("username", this.username.trim())
                content.append("mode", mode)
                http.request({
                    url: `${this.path}/send-verification-code/`,
                    method: "POST",
                    content
                }).then(response => {
                    response = response.json()
                    if(response.status){
                        if(mode == "send"){
                            this.activeStep = 2;
                        }
                        else{
                            this.snackbarMessage = {message: "Verification code resent", icon: "done", iconColor: "success"}
                            this.showSnackbar = true
                        }
                    }
                    else{
                        if(mode == "resend"){
                            this.snackbarMessage = {message: "Failed to resend verification code", icon: "warning", iconColor: "red"}
                            this.showSnackbar = true
                        }
                        else{
                            this.usernameErrors.push(response.error)
                        }
                    }
                    this.sending = false
                }).catch(reason => {
                    if(reason == "The connection timed out. Please try again."){
                        this.snackbarMessage = {message: reason, icon: "warning", iconColor: "red"}
                    }
                    else{
                        this.snackbarMessage = {message: "Failed to complete the request. Please try again.", icon: "warning", iconColor: "red"}
                    }
                    this.showSnackbar = true;
                    this.sending = false;
                })
            }
        },
        verify(){
            if(this.$refs.verificationForm.validate()){
                this.verifying = true;
                this.verificationErrors = []
                var form = new FormData()
                form.append("username", this.username)
                form.append("code", this.code)
                http.request({
                    url: `${this.path}/verify-code/`,
                    method: "POST",
                    content: form
                }).then(response => {
                    response = response.json()
                    if(!response.status){
                        this.verificationErrors.push(response.error)
                    }
                    else{
                        this.activeStep = 3;
                    }
                    this.verifying = false;
                }).catch(reason => {
                    if(reason == "The connection timed out. Please try again."){
                        this.snackbarMessage = {message: reason, icon: "warning", iconColor: "red"}
                    }
                    else{
                        this.snackbarMessage = {message: "Failed to complete the request. Please try again.", icon: "warning", iconColor: "red"}
                    }
                    this.showSnackbar = true;
                    this.verifying = false;
                })
            }
        },
        resetPassword(){
            if(this.$refs.resetPasswordForm.validate()){
                this.resetting = true;
                var form = new FormData()
                form.append("new_password", this.newPassword)
                form.append("username", this.username)
                form.append("code", this.code)
                http.request({
                    url: `${this.path}/reset-password/`,
                    method: "POST",
                    content: form
                }).then(response => {
                    response = response.json()
                    if(response.status){
                        this.activeStep = 4;
                        this.resetting = false;
                    }
                }).catch(reason => {
                    if(reason == "The connection timed out. Please try again."){
                        this.snackbarMessage = {message: reason, icon: "warning", iconColor: "red"}
                    }
                    else{
                        this.snackbarMessage = {message: "Failed to complete the request. Please try again.", icon: "warning", iconColor: "red"}
                    }
                    this.showSnackbar = true;
                    this.resetting = false;
                })
            }
        },
        signIn(){
            this.signingIn = true;
            var form = new FormData()
            form.append("username", this.username)
            form.append("password", this.newPassword)
            http.request({
                url: `${this.path}/sign-in/`, 
                method: "POST",
                content: form
            }).then(response => {
                response = response.json()
                if(response.status){
                    window.location = ""
                }
            }).catch(reason => {
                if(reason == "The connection timed out. Please try again."){
                    this.snackbarMessage = {message: reason, icon: "warning", iconColor: "red"}
                }
                else{
                    this.snackbarMessage = {message: "Failed to complete the request. Please try again.", icon: "warning", iconColor: "red"}
                }
                this.showSnackbar = true;
                this.signingIn = false;
            })
        },
        restart(){
            if(this.activeStep != 1){
                this.activeStep = 1;
                this.usernameErrors = [];
                this.verificationErrors = [];
                this.newPasswordErrors = [];
                this.$refs.sendVerificationCodeForm.reset()
                this.$refs.verificationForm.reset()
                this.$refs.resetPasswordForm.reset()
            }
        },
        requiredRule,
        requiredLengthRule
    },
}
</script> 