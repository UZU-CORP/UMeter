import {Module, VuexModule, Action} from "vuex-module-decorators";
import http from "@/plugins/http";

@Module
export default class StakeholderModule extends VuexModule {

    @Action
    async createStakeholder(stakeholder: IUser, password: string): Promise<IJsonResponse> {
        return http.getJson("", {
            username: stakeholder.username,
            password
        }, "POST");
    }

    @Action
    async updateStakeholder(stakeholder: IUser): Promise<IJsonResponse> {
        return http.getJson("", {
            username: stakeholder.username,
            id: stakeholder.id
        }, "PATCH");
    }

    @Action
    async deleteStakeholder(stakeholder: IUser): Promise<IJsonResponse> {
        return http.getJson("", {
            id: stakeholder.id
        }, "DELETE");
    }

    @Action
    async getStakeholder(username: string): Promise<IJsonResponse> {
        return http.getJson("", {
            username
        }, "GET")
    }

    @Action
    async getStakeholders(query: string): Promise<IJsonResponse> {
        return http.getJson("", {
            query
        }, "GET")
    }

}
