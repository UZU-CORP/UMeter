import {Module, VuexModule, Action, Mutation} from "vuex-module-decorators";
import http from "@/plugins/http";

@Module
export default class SubscriberModule extends VuexModule {
    subscribers: IUser[] = [];
    currentSubscriber!: IUser;
    page: number = 1;
    hasNextPage: boolean = false;

    indicators: {[key: string]: boolean} = {
        creatingSubscriber: false,
        updatingSubscriber: false,
        deletingSubscriber: false,
        loadingSubscribers: false,
        gettingSubscriber: false,
    };

    @Mutation
    toggleIndicator(name: string) {
        this.indicators[name] = !this.indicators[name];
    }

    @Mutation
    addSubscriber(stakeholder: IUser) {
        this.subscribers = [
            stakeholder,
            ...this.subscribers
        ]
    }

    @Mutation
    alterSubscriber(stakeholder: IUser) {
        this.subscribers.forEach((value: IUser, index: number) => {
            if(stakeholder.id == value.id)
                this.subscribers[index] = stakeholder;
        })
    }

    @Mutation
    removeSubscriber(stakeholder: IUser) {
        this.subscribers = this.subscribers.filter((value: IUser) => stakeholder.id != value.id);
    }

    @Mutation
    setCurrentSubscriber(stakeholder: IUser) {
        this.currentSubscriber = stakeholder;
    }

    @Mutation
    setSubscribers(payload: {subscribers: IUser[], refresh: boolean, hasNextPage: boolean}) {
        if(payload.refresh) {
            this.page = 1;
            this.subscribers = payload.subscribers;
        }
        else {
            this.page++;
            this.subscribers.push(...payload.subscribers);
        }
    }

    @Action
    async createSubscriber(stakeholder: IUser) {
        this.context.commit("toggleIndicator", "creatingSubscriber");
        try {
            var response = await http.getJson("", {
                username: stakeholder.username
            }, "POST");
            if(response.status)
                this.context.commit("addSubscriber", response.data);
            else this.context.commit("setErrors", response.errors);
            this.context.commit("toggleIndicator", "creatingSubscriber");
        } catch(error) {
            this.context.commit("toggleIndicator", "creatingSubscriber");
            this.context.commit("setErrors", {server: "Failed to reached server"});
            console.error(error);
        }
    }

    @Action
    async updateSubscriber(stakeholder: IUser) {
        this.context.commit("toggleIndicator", "updatingSubscriber");
        try {
            var response = await http.getJson("", {
                id: stakeholder.id,
                username: stakeholder.username,
            }, "PATCH");
            if(response.status)
                this.context.commit("alterUser", response.data);
            else this.context.commit("setErrors", response.errors);
            this.context.commit("toggleIndicator", "updatingSubscriber");
        } catch(error) {
            this.context.commit("toggleIndicator", "updatingSubscriber");
            this.context.commit("setErrors", {server: "Failed to reached server"});
            console.error(error);
        }
    }

    @Action
    async deleteSubscriber(stakeholder: IUser) {
        this.context.commit("toggleIndicator", "deletingSubscriber");
        try {
            var response = await http.getJson("", {
                id: stakeholder.id
            }, "DELETE");
            if(response.status)
                this.context.commit("removeUser", stakeholder);
            else this.context.commit("setErrors", response.errors);
            this.context.commit("toggleIndicator", "deletingSubscriber");
        } catch(error) {
            this.context.commit("toggleIndicator", "deletingSubscriber");
            this.context.commit("setErrors", {server: "Failed to reached server"});
            console.error(error);
        }
    }

    @Action
    async getSubscriber(username: string) {
        this.context.commit("toggleIndicator", "gettingSubscriber");
        try {
            var response = await http.getJson("", {
                username
            }, "GET")
            if(response.status)
                this.context.commit("setCurrentUser", response.data)
            else this.context.commit("setErrors", response.errors);
            this.context.commit("toggleIndicator", "gettingSubscriber");
        } catch(error) {
            this.context.commit("toggleIndicator", "gettingSubscriber");
            this.context.commit("setErrors", {server: "Failed to reached server"});
            console.error(error);
        }
    }

    @Action
    async getSubscribers(query: string, refresh: boolean = false) {
        this.context.commit("toggleIndicator", "loadingSubscribers");
        try {
            var response = await http.getJson("", {
                query,
                page: this.page
            }, "GET")
            if(response.status)
                this.context.commit("setUsers", {
                    subscribers: response.data,
                    hasNextPage: response.hasNextPage,
                    refresh
                })
            else this.context.commit("setErrors", response.errors);
            this.context.commit("toggleIndicator", "loadingSubscribers");
        } catch(error) {
            this.context.commit("toggleIndicator", "loadingSubscribers");
            this.context.commit("setErrors", {server: "Failed to reached server"});
            console.error(error);
        }
    }

}
