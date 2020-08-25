<template>
    <v-app>
        <v-app-bar app color="transparent" flat>
            <h1 class="title">UMeter</h1>
            <v-spacer/>
            <v-btn icon @click="showDrawer = true">
                <v-icon>mdi-menu</v-icon>
            </v-btn>
        </v-app-bar>
        <v-navigation-drawer right app v-model="showDrawer" class="text-center">
            <br><br>
            <div class="title py-4 active-navigation" v-ripple>HOME</div>
            <div class="title py-4" v-ripple>ABOUT</div>
            <div class="title py-4" v-ripple>FAQ</div>
            <div class="title py-4" v-ripple>SUPPORT</div>
            <div class="title py-4 primary black--text" v-ripple>SIGN IN</div>
        </v-navigation-drawer>
        <v-main>
            <v-container fill-height align-end justify-center align-content-space-between>
                <v-sheet height="50vh" width="100vw" color="transparent">
                    <v-container fill-height align-center justify-center>
                        <div class="text-center">
                            <p class="display-1 mb-5">GET THE MOST OUT OF YOUR ELECTRITY</p>
                            <v-tabs-items v-model="messageTab" style="background: transparent">
                                <v-tab-item :key="1">
                                    <span>Get the most out of your electrity...</span>
                                </v-tab-item>
                                <v-tab-item :key="2">
                                    <span>Simple household electrity for everyone</span>
                                </v-tab-item>
                            </v-tabs-items>
                            <center class="mt-5">
                                <v-icon @click="messageTab = 0" :color="messageTab == 0? 'primary' : 'grey'">mdi-record</v-icon>
                                <v-icon @click="messageTab = 1" :color="messageTab == 1? 'primary' : 'grey'">mdi-record</v-icon>
                            </center>
                        </div>
                    </v-container>
                </v-sheet>
                <div style="width: 100%" class="text-center">
                    <v-btn large block rounded @click="showSignInDialog = true" class="my-3 font-weight-bold" color="primary black--text">sign in</v-btn>
                    <v-btn large block rounded @click="showSignUpDialog = true" class="my-3 font-weight-bold" color="primary" outlined>sign up</v-btn>
                    <span class="caption">UMeter &copy; 2020</span>
                </div>
            </v-container>
            <v-dialog v-model="showSignInDialog" persistent>
                <v-card>
                    <v-card-title>
                        <span>Sign In</span>
                        <v-spacer/>
                        <v-btn icon @click="showSignInDialog = false">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-card-text>
                        <v-form ref="signInForm">
                        <v-spacer/>
                            <v-text-field outlined rounded label="Username" prepend-inner-icon="mdi-account"/>
                            <v-text-field outlined rounded label="Password" prepend-inner-icon="mdi-lock"/>
                            <v-checkbox label="Remember me"/>
                            <v-btn type="submit" color="primary" rounded large block class="font-weight-bold black--text">Sign In</v-btn>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-dialog>
            <v-dialog v-model="showSignUpDialog" persistent>
                <v-card>
                    <v-card-title>
                        <span>Sign Up</span>
                        <v-spacer/>
                        <v-btn icon @click="showSignUpDialog = false">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-card-text>
                        <v-form ref="signInForm">
                        <v-spacer/>
                            <v-text-field outlined rounded label="Username" prepend-inner-icon="mdi-account"/>
                            <v-text-field outlined rounded label="Password" prepend-inner-icon="mdi-lock"/>
                            <v-checkbox label="Remember me"/>
                            <v-btn type="submit" color="primary" rounded large block class="font-weight-bold black--text">Sign Up</v-btn>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-main>
    </v-app>
</template>

<script lang="typescript" src="./Home.ts">
</script>

<style lang="scss">
    .active-navigation {
        color: #3FFD20;
        border-left: #3FFD20 5px solid;
        background: rgba(0,0,0,.2);
    }
</style>