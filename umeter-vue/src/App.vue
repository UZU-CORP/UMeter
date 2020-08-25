<template>
    <v-app>
        <v-fade-transition>
            <router-view/>
        </v-fade-transition>
        <v-toast/>
        <v-confirmation/>
        <v-authentication outline rounded url="/accounts/authenticate/"/>
    </v-app>
</template>

<script>
import VToast from "./vuetify-extensions/VToast";
import VConfirmation from "./vuetify-extensions/VConfirmation";
import VAuthentication from "./vuetify-extensions/VAuthentication";

export default {
    components: {
        VToast,
        VConfirmation,
        VAuthentication
    }
}
</script>