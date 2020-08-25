import Vue from 'vue'
import Vuex from 'vuex'

import MeterModule from "./MeterModule";
import RoleModule from "./RoleModule";
import StakeholderModule from "./StakeholderModule";
import SubscriberModule from "./SubscriberModule";
import SubscriptionModule from "./SubscriptionModule";
import TariffModule from "./TariffModule";
import TicketModule from "./TicketModule";
import ErrorHandlerModule from "./ErrorHandlerModule";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    MeterModule,
    RoleModule,
    StakeholderModule,
    SubscriberModule,
    SubscriptionModule,
    TariffModule,
    TicketModule,
    ErrorHandlerModule
  }
});
