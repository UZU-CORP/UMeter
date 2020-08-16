import {Module, VuexModule, Action, Mutation} from "vuex-module-decorators";
import http from "@/plugins/http";

@Module
export default class MeterModule extends VuexModule {
    meters: IMeter[] = [];
    
    indicators: {[key: string] : boolean} = {
        creatingMeter: false,
        updatingMeter: false,
        deletingMeter: false,
        loadingMeters: false,
        gettingMeter: false,
        turningOffMeter: false,
        settingDailyPowerThreshold: false,
        settingRateThreshold: false,
        applyingForMeter: false,
        approvingMeter: false
    };

    @Mutation
    toggleIndicator(name: string) {
        this.indicators[name] = !this.indicators[name];
    }

    @Action
    async createMeter(meter: IMeter) {
        this.context.commit("toggleIndicator", "creatingMeter")
        try {
            var response = await http.getJson("", {
                ...meter
            }, "POST");
            this.context.commit("toggleIndicator", "creatingMeter");
            if(response.status)
                this.meters = [meter, ...this.meters]
        } catch(error) {
            this.context.commit("toggleIndicator", "creatingMeter");
            console.log(error);
        }
    }

    @Action
    async updateMeter(meter: IMeter) {
        this.context.commit("toggleIndicator", "updatingMeter");
        try {
            var response = await http.getJson("", {
                ...meter
            }, "PATCH");
            this.context.commit("toggleIndicator", "updatingMeter");
            if(response.status)
                this.meters.forEach((value: IMeter, index: number) => {
                    if(value.id == meter.id)
                        this.meters[index] = meter;
                })
        } catch(error) {
            this.context.commit("toggleIndicator", "updatingMeter");
            console.log(error);
        }
    }

    @Action
    async deleteMeter(meter: IMeter) {
        this.context.commit("toggleIndicator", "deletingMeter")
        try {
            var response = await http.getJson("", {
                id: meter.id
            }, "DELETE");
            this.context.commit("toggleIndicator", "deletingMeter");
            if(response.status)
                this.meters = this.meters.filter((value: IMeter, index: number) => meter.id != value.id);
        } catch(error) {
            this.context.commit("toggleIndicator", "deletingMeter");
            console.log(error);
        }
    }

    @Action
    async getMeter(id: number) {
        this.context.commit("toggleIndicator", "gettingMeter");
        try {
            var response = await http.getJson("", {
                id
            }, "GET");
            this.context.commit("toggleIndicator", "gettingMeter");
        } catch(error) {
            this.context.commit("toggleIndicator", "gettingMeter");
            console.log(error);
        }
    }

    @Action
    async getMeters(query: string, page: number) {
        this.context.commit("toggleIndicator", "loadingMeters");
        try {
            var response = await http.getJson("", {
                query,
                page
            }, "GET")
            this.context.commit("toggleIndicator", "loadingMeters");
        } catch(error) {
            this.context.commit("toggleIndicator", "loadingMeters");
            console.log(error);
        }
    }

    @Action
    async turnOffMeter(meter: IMeter) {
        this.context.commit("toggleIndicator", "turningOffMeter");
        try {
            var response = await http.getJson("", {
                id: meter.id
            }, "GET");
            this.context.commit("toggleIndicator", "turningOffMeter");
        } catch(error) {
            this.context.commit("toggleIndicator", "turningOffMeter");
            console.log(error);
        }
    }

    @Action
    async setDailyPowerThreshold(meter: IMeter, kwh: number) {
        this.context.commit("toggleIndicator", "settingDailyPowerThreshold");
        try {
            var response = await http.getJson("", {
                kwh,
                id: meter.id
            }, "POST")
            if(response.status)
                meter.dailyPowerThreshold = kwh;
            this.context.commit("toggleIndicator", "settingDailyPowerThreshold");
        } catch(error) {
            this.context.commit("toggleIndicator", "settingDailyPowerThreshold");
            console.log(error);
        }
    }

    @Action
    async setRateThreshold(meter: IMeter, kwh: number) {
        this.context.commit("toggleIndicator", "settingRateThreshold");
        try {
            var response = await http.getJson("", {
                kwh,
                id: meter.id
            }, "POST")
            if(response.status)
                meter.rateThreshold = kwh;
            this.context.commit("toggleIndicator", "settingRateThreshold");
        } catch(error) {
            this.context.commit("toggleIndicator", "settingRateThreshold");
            console.log(error);
        }
    }

    @Action
    async applyForMeter(meter: IMeter) {
        this.context.commit("toggleIndicator", "applyingForMeter");
        try {
            var response = await http.getJson("", {
                id: meter.id
            }, "POST")
            if(response.status)
                meter.approvalStatus = "pending";
            this.context.commit("toggleIndicator", "applyingForMeter");
        } catch(error) {
            this.context.commit("toggleIndicator", "applyingForMeter");
            console.log(error);
        }
    }

    @Action
    async approveMeter(meter: IMeter) {
        this.context.commit("toggleIndicator", "approvingMeter");
        try {
            var response = await http.getJson("", {
                id: meter.id
            }, "POST")
            if(response.status)
                meter.approvalStatus = "pending";
            this.context.commit("toggleIndicator", "approvingMeter");
        } catch(error) {
            this.context.commit("toggleIndicator", "approvingMeter");
            console.log(error);
        }
    }

}
