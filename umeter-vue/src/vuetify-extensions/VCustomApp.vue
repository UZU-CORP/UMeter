<template>
    <v-app v-on="app.on" v-bind="app.bind">
        <template v-if="!loading">
            <v-navigation-drawer app v-if="$vuetify.breakpoint.mdAndUp" v-model="showDrawer" :mini-variant="mini" v-bind="navigationDrawer.bind" v-on="navigationDrawer.on">
                <slot name="navigation-drawer" :mini="mini"/>
                <v-list v-if="drawerItems.length > 0">
                    <v-list-tile class="my-2" :to="item.to" @click="item.click" v-for="item in drawerItems" :key="item.name">
                        <v-list-tile-action @click="mini = true">
                            <v-badge color="red" right :value="item.badgeValue > 0">
                                <template slot="badge">
                                    <span class="font-weight-bold caption">{{item.badgeValue > 99? "99+" : item.badgeValue}}</span>
                                </template>
                                <v-icon :color="$route.path.startsWith(item.to)? active : passive">{{item.icon}}</v-icon>
                            </v-badge>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-text class="font-weight-bold" :class="$route.path.startsWith(item.to)? `${active}--text` : `${passive}--text`">{{item.name}}</v-list-tile-text>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile class="my-2" @click="showSignOutDialog = true">
                        <v-list-tile-action @click="mini = true">
                            <v-icon :color="passive">power_settings_new</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-text class="font-weight-bold" :class="`${passive}--text`">Sign Out</v-list-tile-text>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-navigation-drawer>
            <v-toolbar app v-bind="toolbar.bind" v-on="toolbar.on" :flat="waterfall && flat">
                <v-btn icon large @click="showDrawer = !showDrawer; mini = !mini" class="mr-2" v-if="$vuetify.breakpoint.mdAndUp">
                    <v-icon>menu</v-icon>
                </v-btn>
                <slot name="toolbar"/>
                <v-spacer/>
                <template v-if="$scopedSlots['notifications']">
                    <v-menu offset-y="30" v-if="$vuetify.breakpoint.smAndUp" :close-on-content-click="false" v-model="showNotificationsDrawer">
                        <v-btn icon slot="activator">
                            <v-badge color="red" right :value="notificationCount > 0" overlap>
                                <template slot="badge">
                                    <span class="font-weight-bold caption">{{notificationCount > 99? "99+" : notificationCount}}</span>
                                </template>
                                <v-icon>notifications</v-icon>
                            </v-badge>
                        </v-btn>
                        <v-sheet width="537">
                            <v-toolbar dense dark flat>
                                <v-icon>notifications</v-icon>
                                <span class="subheading font-weight-bold ml-3">Notifications</span>
                                <v-spacer/>
                                <v-btn icon @click="refreshNotifications = true" :loading="refreshNotifications">
                                    <v-icon>refresh</v-icon>
                                </v-btn>
                            </v-toolbar>
                            <v-card-text style="overflow-y: auto; height:70vh" id="notifications-menu">
                                <slot name="notifications"/>
                            </v-card-text>
                        </v-sheet>
                    </v-menu>
                    <v-btn icon @click="showNotificationsDrawer = true" v-else>
                        <v-badge color="red" right :value="notificationCount > 0" overlap>
                            <template slot="badge">
                                <span class="font-weight-bold caption">{{notificationCount > 99? "99+" : notificationCount}}</span>
                            </template>
                            <v-icon>notifications</v-icon>
                        </v-badge>
                    </v-btn>
                </template>
                <slot name="more"/>
                <v-menu :offset-y="30" v-if="$scopedSlots['menu']">
                    <v-btn icon slot="activator" v-on="on" slot-scope="{on}">
                        <v-icon>more_vert</v-icon>
                    </v-btn>
                    <v-card>
                        <v-card-text>
                            <slot name="menu"/>
                        </v-card-text>
                    </v-card>
                </v-menu>
                <slot slot="extension" name="toolbar-extension"/>
            </v-toolbar>
            <v-content>
                <slot/>
            </v-content>
        </template>
        <v-bottom-nav app :value="$vuetify.breakpoint.smAndDown" shift :active.sync="bottomNav" v-bind="bottomNav.bind" v-on="bottomNav.on">
            <v-btn :to="item.to" v-for="(item, index) in drawerItems" :key="index" @click="">
                <span>{{item.name}}</span>
                <v-icon>{{item.icon}}</v-icon>
            </v-btn>
            <v-btn @click="showSignOutDialog = true">
                <span>Sign Out</span>
                <v-icon>power_settings_new</v-icon>
            </v-btn>
        </v-bottom-nav>
        <v-dialog v-model="showSignOutDialog" width="300" persistent>
            <v-card>
                <v-card-title>
                    <h2 class="font-weight-bold title"><v-icon>power_settings_new</v-icon> Sign Out</h2>
                </v-card-title>
                <v-card-text>
                    <span class="subheading">Are you sure you want to sign out?</span>
                    <v-card-actions>
                        <v-btn round small class="font-weight-bold" color="primary" @click="signOut" :loading="signingOut">yes</v-btn>
                        <v-btn round small class="font-weight-bold" @click="showSignOutDialog = false; bottomNav = routeIndex" :disabled="signingOut">no</v-btn>
                    </v-card-actions>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog :value="loading" persistent width="200">
            <v-card>
                <v-card-text>
                    <span class="ml-2">Initializing</span><br>
                    <v-progress-linear color="primary" indeterminate width="2" size="30"/>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-bottom-sheet v-model="showNotificationsDrawer" v-if="$vuetify.breakpoint.xs">
            <v-sheet>
                <v-toolbar dense color="secondary" dark flat>
                    <v-icon>notifications</v-icon>
                    <span class="subheading font-weight-bold ml-3">Notifications</span>
                    <v-spacer/>
                    <v-btn icon @click="refreshNotifications = true" :loading="refreshNotifications">
                        <v-icon>refresh</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text style="overflow-y: auto; height: 70vh" id="notifications-bottom-sheet">
                    <slot name="notifications"/>
                </v-card-text>
            </v-sheet>
        </v-bottom-sheet>
    </v-app>
</template>

<script>
import VToast from './VToast.vue'

export default {
  props: {
    toast: Object,
    refreshNotifications: Boolean,
    drawerItems: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: true
    },
    waterfall: Boolean,
    passive: String,
    active: String,
    toolbar: {
      type: Object,
      default: {
        bind: {},
        on: {}
      }
    },
    app: {
      type: Object,
      default: {
        bind: {},
        on: {}
      }
    },
    navigationDrawer: {
      type: Object,
      default: {
        bind: {},
        on: {}
      }
    },
    bottomNav: {
      type: Object,
      default: {
        bind: {},
        on: {}
      }
    },
    signOutFunction: Function
  },
  components: {
    VToast
  },
  data () {
    return {
      setShowDrawer: false,
      setMini: true,
      showSignOutDialog: false,
      showNotificationsDrawer: false,
      signingOut: false,
      flat: true,
      sendingMessage: false,
      notificationCount: 0
    }
  },
  computed: {
    mini: {
      set (value) {
        this.setMini = value
      },
      get () {
        if (this.$vuetify.breakpoint.lgAndUp) {
          return this.setMini
        } else {
          return false
        }
      }
    },
    showDrawer: {
      set (value) {
        this.setShowDrawer = value
      },
      get () {
        if (this.$vuetify.breakpoint.lgAndUp) {
          return true
        } else {
          return this.setShowDrawer
        }
      }
    },
    routeIndex () {
      for (const route in this.drawerItems) {
        if (this.drawerItems[route].to == this.$route) {
          console.log('hello')
        }
      }
    }
  },
  methods: {
    waterfallScroll () {
      this.flat = window.scrollY == 0
    },
    signOut () {
      this.signingOut = true
      this.signOutFunction().then(() => this.signingOut = false)
    }
  },
  watch: {
    showNotificationsDrawer () {
      this.showDrawer = false
    },
    showSignOutDialog (newValue) {
      if (!newValue) {

      }
    }
  },
  mounted () {
    document.addEventListener('scroll', this.waterfallScroll)
  },
  destroyed () {
    document.removeEventListener('scroll', this.waterfallScroll)
  }
}
</script>
