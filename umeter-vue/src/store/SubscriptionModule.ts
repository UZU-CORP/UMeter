import {Module, VuexModule, Action, Mutation} from "vuex-module-decorators";
import http from "@/plugins/http";

@Module
export default class SubscriptionModule extends VuexModule {
    subscriptions: ISubscription[] = [];
    currentSubscription!: ISubscription;
    page: number = 1;
    hasNextPage: boolean = false;

    indicators: {[key: string]: boolean} = {
        creatingSubscription: false,
        updatingSubscription: false,
        deletingSubscription: false,
        loadingSubscriptions: false,
        gettingSubscription: false,
        creatingInvoice: false,
    };

    @Mutation
    toggleIndicator(name: string) {
        this.indicators[name] = !this.indicators[name];
    }

    @Mutation
    addSubscription(subscription: ISubscription) {
        this.subscriptions = [
            subscription,
            ...this.subscriptions
        ]
    }

    @Mutation
    alterSubscription(subscription: ISubscription) {
        this.subscriptions.forEach((value: ISubscription, index: number) => {
            if(subscription.id == value.id)
                this.subscriptions[index] = subscription;
        })
    }

    @Mutation
    removeSubscription(subscription: ISubscription) {
        this.subscriptions = this.subscriptions.filter((value: ISubscription) => subscription.id != value.id);
    }

    @Mutation
    setCurrentSubscription(subscription: ISubscription) {
        this.currentSubscription = subscription;
    }

    @Mutation
    setSubscriptions(payload: {subscriptions: ISubscription[], refresh: boolean, hasNextPage: boolean}) {
        if(payload.refresh) {
            this.page = 1;
            this.subscriptions = payload.subscriptions;
        }
        else {
            this.page++;
            this.subscriptions.push(...payload.subscriptions);
        }
    }

    @Action
    async createSubscription(subscription: ISubscription) {
        this.context.commit("toggleIndicator", "creatingSubscription");
        try {
            var response = await http.getJson("", {
                ...subscription
            }, "POST");
            if(response.status)
                this.context.commit("addSubscription", response.data);
            else this.context.commit("setErrors", response.errors);
            this.context.commit("toggleIndicator", "creatingSubscription");
        } catch(error) {
            this.context.commit("toggleIndicator", "creatingSubscription");
            this.context.commit("setErrors", {server: "Failed to reached server"});
            console.error(error);
        }
    }

    @Action
    async updateSubscription(subscription: ISubscription) {
        this.context.commit("toggleIndicator", "updatingSubscription");
        try {
            var response = await http.getJson("", {
                ...subscription
            }, "PATCH");
            if(response.status)
                this.context.commit("alterSubscription", response.data);
            else this.context.commit("setErrors", response.errors);
            this.context.commit("toggleIndicator", "updatingSubscription");
        } catch(error) {
            this.context.commit("toggleIndicator", "updatingSubscription");
            this.context.commit("setErrors", {server: "Failed to reached server"});
            console.error(error);
        }
    }

    @Action
    async deleteSubscription(subscription: ISubscription) {
        this.context.commit("toggleIndicator", "deletingSubscription");
        try {
            var response = await http.getJson("", {
                id: subscription.id
            }, "DELETE");
            if(response.status)
                this.context.commit("removeSubscription", subscription);
            else this.context.commit("setErrors", response.errors);
            this.context.commit("toggleIndicator", "deletingSubscription");
        } catch(error) {
            this.context.commit("toggleIndicator", "deletingSubscription");
            this.context.commit("setErrors", {server: "Failed to reached server"});
            console.error(error);
        }
    }

    @Action
    async getSubscription(id: number) {
        this.context.commit("toggleIndicator", "gettingSubscription");
        try {
            var response = await http.getJson("", {
                id
            }, "GET")
            if(response.status)
                this.context.commit("setCurrentSubscription", response.data)
            else this.context.commit("setErrors", response.errors);
            this.context.commit("toggleIndicator", "gettingSubscription");
        } catch(error) {
            this.context.commit("toggleIndicator", "gettingSubscription");
            this.context.commit("setErrors", {server: "Failed to reached server"});
            console.error(error);
        }
    }

    @Action
    async getSubscriptions(query: string, refresh: boolean = false) {
        this.context.commit("toggleIndicator", "loadingSubscriptions");
        try {
            var response = await http.getJson("", {
                query,
                page: this.page
            }, "GET")
            if(response.status)
                this.context.commit("setSubscriptions", {
                    subscriptions: response.data,
                    hasNextPage: response.hasNextPage,
                    refresh
                })
            else this.context.commit("setErrors", response.errors);
            this.context.commit("toggleIndicator", "loadingSubscriptions");
        } catch(error) {
            this.context.commit("toggleIndicator", "loadingSubscriptions");
            this.context.commit("setErrors", {server: "Failed to reached server"});
            console.error(error);
        }
    }

    @Action
    async createInvoice(subscription: ISubscription) {
        this.context.commit("toggleIndicator", "creatingInvoice");
        try {
            var response = await http.getJson("", {
                ...subscription
            }, "POST");
            if(response.status)
                this.context.commit("addSubscription", response.data);
            else this.context.commit("setErrors", response.errors);
            this.context.commit("toggleIndicator", "creatingSubscription");
        } catch(error) {
            this.context.commit("toggleIndicator", "creatingSubscription");
            this.context.commit("setErrors", {server: "Failed to reached server"});
            console.error(error);
        }
    }

}
