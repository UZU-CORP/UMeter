import {Module, VuexModule, Action} from "vuex-module-decorators";
import http from "@/plugins/http";

@Module({namespaced: true})
export default class AdminModule extends VuexModule {

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

    @Action
    async createRole(role: IRole): Promise<IJsonResponse> {
        return http.getJson("", {
            definition: role.definition
        }, "POST");
    }

    @Action
    async updateRole(role: IRole): Promise<IJsonResponse> {
        return http.getJson("", {
            id: role.id,
            definition: role.definition,
        }, "PATCH");
    }

    @Action
    async deleteRole(role: IRole): Promise<IJsonResponse> {
        return http.getJson("", {
            id: role.id
        }, "DELETE");
    }

    @Action
    async getRole(definition: string): Promise<IJsonResponse> {
        return http.getJson("", {
            definition
        }, "GET")
    }

    @Action
    async getRoles(query: string): Promise<IJsonResponse> {
        return http.getJson("", {
            query
        }, "GET")
    }
    
    @Action
    async createMeter(meter: IMeter): Promise<IJsonResponse> {
        return http.getJson("", {
            subscriber: meter.subscriber.id,
            stakeholder: meter.stakeholder?.id
        }, "POST");
    }

    @Action
    async updateMeter(meter: IMeter): Promise<IJsonResponse> {
        return http.getJson("", {
            id: meter.id,
            subscriber: meter.subscriber.id,
            stakeholder: meter.stakeholder?.id
        }, "PATCH");
    }

    @Action
    async deleteMeter(meter: IMeter): Promise<IJsonResponse> {
        return http.getJson("", {
            id: meter.id
        }, "DELETE");
    }

    @Action
    async getMeter(id: number): Promise<IJsonResponse> {
        return http.getJson("", {
            id
        }, "GET")
    }

    @Action
    async getMeters(query: string): Promise<IJsonResponse> {
        return http.getJson("", {
            query
        }, "GET")
    }