import {Module, VuexModule, Action, Mutation} from "vuex-module-decorators";
import http from "@/plugins/http";

@Module
export default class TariffModule extends VuexModule {
    tariff: ITariff[] = [];
    currentTariff!: ITariff;
    page: number = 1;
    hasNextPage: boolean = false;

    indicators: {[key: string]: boolean} = {
        creatingTariff: false,
        updatingTariff: false,
        deletingTariff: false,
        loadingTariffs: false,
        gettingTariff: false,
        creatingInvoice: false,
    };

    @Mutation
    toggleIndicator(name: string) {
        this.indicators[name] = !this.indicators[name];
    }

    @Mutation
    addTariff(tariff: ITariff) {
        this.tariff = [
            tariff,
            ...this.tariff
        ]
    }

    @Mutation
    alterTariff(tariff: ITariff) {
        this.tariff.forEach((value: ITariff, index: number) => {
            if(tariff.id == value.id)
                this.tariff[index] = tariff;
        })
    }

    @Mutation
    removeTariff(tariff: ITariff) {
        this.tariff = this.tariff.filter((value: ITariff) => tariff.id != value.id);
    }

    @Mutation
    setCurrentTariff(tariff: ITariff) {
        this.currentTariff = tariff;
    }

    @Mutation
    setTariffs(payload: {tariff: ITariff[], refresh: boolean, hasNextPage: boolean}) {
        if(payload.refresh) {
            this.page = 1;
            this.tariff = payload.tariff;
        }
        else {
            this.page++;
            this.tariff.push(...payload.tariff);
        }
    }

    @Action
    async createTariff(tariff: ITariff) {
        this.context.commit("toggleIndicator", "creatingTariff");
        try {
            var response = await http.getJson("", {
                ...tariff
            }, "POST");
            if(response.status)
                this.context.commit("addTariff", response.data);
            else this.context.commit("setErrors", response.errors);
            this.context.commit("toggleIndicator", "creatingTariff");
        } catch(error) {
            this.context.commit("toggleIndicator", "creatingTariff");
            this.context.commit("setErrors", {server: "Failed to reached server"});
            console.error(error);
        }
    }

    @Action
    async updateTariff(tariff: ITariff) {
        this.context.commit("toggleIndicator", "updatingTariff");
        try {
            var response = await http.getJson("", {
                ...tariff
            }, "PATCH");
            if(response.status)
                this.context.commit("alterTariff", response.data);
            else this.context.commit("setErrors", response.errors);
            this.context.commit("toggleIndicator", "updatingTariff");
        } catch(error) {
            this.context.commit("toggleIndicator", "updatingTariff");
            this.context.commit("setErrors", {server: "Failed to reached server"});
            console.error(error);
        }
    }

    @Action
    async deleteTariff(tariff: ITariff) {
        this.context.commit("toggleIndicator", "deletingTariff");
        try {
            var response = await http.getJson("", {
                id: tariff.id
            }, "DELETE");
            if(response.status)
                this.context.commit("removeTariff", tariff);
            else this.context.commit("setErrors", response.errors);
            this.context.commit("toggleIndicator", "deletingTariff");
        } catch(error) {
            this.context.commit("toggleIndicator", "deletingTariff");
            this.context.commit("setErrors", {server: "Failed to reached server"});
            console.error(error);
        }
    }

    @Action
    async getTariff(id: number) {
        this.context.commit("toggleIndicator", "gettingTariff");
        try {
            var response = await http.getJson("", {
                id
            }, "GET")
            if(response.status)
                this.context.commit("setCurrentTariff", response.data)
            else this.context.commit("setErrors", response.errors);
            this.context.commit("toggleIndicator", "gettingTariff");
        } catch(error) {
            this.context.commit("toggleIndicator", "gettingTariff");
            this.context.commit("setErrors", {server: "Failed to reached server"});
            console.error(error);
        }
    }

    @Action
    async getTariffs(query: string, refresh: boolean = false) {
        this.context.commit("toggleIndicator", "loadingTariffs");
        try {
            var response = await http.getJson("", {
                query,
                page: this.page
            }, "GET")
            if(response.status)
                this.context.commit("setTariffs", {
                    tariff: response.data,
                    hasNextPage: response.hasNextPage,
                    refresh
                })
            else this.context.commit("setErrors", response.errors);
            this.context.commit("toggleIndicator", "loadingTariffs");
        } catch(error) {
            this.context.commit("toggleIndicator", "loadingTariffs");
            this.context.commit("setErrors", {server: "Failed to reached server"});
            console.error(error);
        }
    }

    @Action
    async createInvoice(tariff: ITariff) {
        this.context.commit("toggleIndicator", "creatingInvoice");
        try {
            var response = await http.getJson("", {
                ...tariff
            }, "POST");
            if(response.status)
                this.context.commit("addTariff", response.data);
            else this.context.commit("setErrors", response.errors);
            this.context.commit("toggleIndicator", "creatingTariff");
        } catch(error) {
            this.context.commit("toggleIndicator", "creatingTariff");
            this.context.commit("setErrors", {server: "Failed to reached server"});
            console.error(error);
        }
    }

}