import {Module, VuexModule, Action, Mutation} from "vuex-module-decorators";
import http from "@/plugins/http";

@Module
export default class StakeholderModule extends VuexModule {
    stakeholders: IUser[] = [];
    currentStakeholder!: IUser;
    page: number = 1;
    hasNextPage: boolean = false;

    indicators: {[key: string]: boolean} = {
        creatingStakeholder: false,
        updatingStakeholder: false,
        deletingStakeholder: false,
        loadingStakeholders: false,
        gettingStakeholder: false,
    };

    @Mutation
    toggleIndicator(name: string) {
        this.indicators[name] = !this.indicators[name];
    }

    @Mutation
    addStakeholder(stakeholder: IUser) {
        this.stakeholders = [
            stakeholder,
            ...this.stakeholders
        ]
    }

    @Mutation
    alterStakeholder(stakeholder: IUser) {
        this.stakeholders.forEach((value: IUser, index: number) => {
            if(stakeholder.id == value.id)
                this.stakeholders[index] = stakeholder;
        })
    }

    @Mutation
    removeStakeholder(stakeholder: IUser) {
        this.stakeholders = this.stakeholders.filter((value: IUser) => stakeholder.id != value.id);
    }

    @Mutation
    setCurrentStakeholder(stakeholder: IUser) {
        this.currentStakeholder = stakeholder;
    }

    @Mutation
    setStakeholders(payload: {stakeholders: IUser[], refresh: boolean, hasNextPage: boolean}) {
        if(payload.refresh) {
            this.page = 1;
            this.stakeholders = payload.stakeholders;
        }
        else {
            this.page++;
            this.stakeholders.push(...payload.stakeholders);
        }
    }

    @Action
    async createStakeholder(stakeholder: IUser) {
        this.context.commit("toggleIndicator", "creatingStakeholder");
        try {
            var response = await http.getJson("", {
                username: stakeholder.username
            }, "POST");
            if(response.status)
                this.context.commit("addStakeholder", response.data);
            else this.context.commit("setErrors", response.errors);
            this.context.commit("toggleIndicator", "creatingStakeholder");
        } catch(error) {
            this.context.commit("toggleIndicator", "creatingStakeholder");
            this.context.commit("setErrors", {server: "Failed to reached server"});
            console.error(error);
        }
    }

    @Action
    async updateStakeholder(stakeholder: IUser) {
        this.context.commit("toggleIndicator", "updatingStakeholder");
        try {
            var response = await http.getJson("", {
                id: stakeholder.id,
                username: stakeholder.username,
            }, "PATCH");
            if(response.status)
                this.context.commit("alterUser", response.data);
            else this.context.commit("setErrors", response.errors);
            this.context.commit("toggleIndicator", "updatingStakeholder");
        } catch(error) {
            this.context.commit("toggleIndicator", "updatingStakeholder");
            this.context.commit("setErrors", {server: "Failed to reached server"});
            console.error(error);
        }
    }

    @Action
    async deleteStakeholder(stakeholder: IUser) {
        this.context.commit("toggleIndicator", "deletingStakeholder");
        try {
            var response = await http.getJson("", {
                id: stakeholder.id
            }, "DELETE");
            if(response.status)
                this.context.commit("removeUser", stakeholder);
            else this.context.commit("setErrors", response.errors);
            this.context.commit("toggleIndicator", "deletingStakeholder");
        } catch(error) {
            this.context.commit("toggleIndicator", "deletingStakeholder");
            this.context.commit("setErrors", {server: "Failed to reached server"});
            console.error(error);
        }
    }

    @Action
    async getStakeholder(username: string) {
        this.context.commit("toggleIndicator", "gettingStakeholder");
        try {
            var response = await http.getJson("", {
                username
            }, "GET")
            if(response.status)
                this.context.commit("setCurrentUser", response.data)
            else this.context.commit("setErrors", response.errors);
            this.context.commit("toggleIndicator", "gettingStakeholder");
        } catch(error) {
            this.context.commit("toggleIndicator", "gettingStakeholder");
            this.context.commit("setErrors", {server: "Failed to reached server"});
            console.error(error);
        }
    }

    @Action
    async getStakeholders(query: string, refresh: boolean = false) {
        this.context.commit("toggleIndicator", "loadingStakeholders");
        try {
            var response = await http.getJson("", {
                query,
                page: this.page
            }, "GET")
            if(response.status)
                this.context.commit("setUsers", {
                    stakeholders: response.data,
                    hasNextPage: response.hasNextPage,
                    refresh
                })
            else this.context.commit("setErrors", response.errors);
            this.context.commit("toggleIndicator", "loadingStakeholders");
        } catch(error) {
            this.context.commit("toggleIndicator", "loadingStakeholders");
            this.context.commit("setErrors", {server: "Failed to reached server"});
            console.error(error);
        }
    }

}
