import {Module, VuexModule, Action} from "vuex-module-decorators";
import http from "@/plugins/http";

@Module
export default class RoleModule extends VuexModule {

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

}
