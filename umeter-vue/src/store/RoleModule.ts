import {Module, VuexModule, Action, Mutation} from "vuex-module-decorators";
import http from "@/plugins/http";

@Module
export default class RoleModule extends VuexModule {
    roles: IRole[] = [];
    currentRole!: IRole;
    page: number = 1;
    hasNextPage: boolean = false;

    indicators: {[key: string]: boolean} = {
        creatingRole: false,
        updatingRole: false,
        deletingRole: false,
        loadingRoles: false,
        gettingRole: false,
    };

    @Mutation
    toggleIndicator(name: string) {
        this.indicators[name] = !this.indicators[name];
    }

    @Mutation
    addRole(role: IRole) {
        this.roles = [
            role,
            ...this.roles
        ]
    }

    @Mutation
    alterRole(role: IRole) {
        this.roles.forEach((value: IRole, index: number) => {
            if(role.id == value.id)
                this.roles[index] = role;
        })
    }

    @Mutation
    removeRole(role: IRole) {
        this.roles = this.roles.filter((value: IRole) => role.id != value.id);
    }

    @Mutation
    setCurrentRole(role: IRole) {
        this.currentRole = role;
    }

    @Mutation
    setRoles(payload: {roles: IRole[], refresh: boolean, hasNextPage: boolean}) {
        this.page = payload.refresh? 1 : this.page + 1;
        this.roles = this.page == 2? payload.roles : [
            ...this.roles,
            ...payload.roles
        ];
    }

    @Action
    async createRole(role: IRole) {
        this.context.commit("toggleIndicator", "creatingRole");
        try {
            var response = await http.getJson("", {
                definition: role.definition
            }, "POST");
            if(response.status)
                this.context.commit("addRole", response.data);
            else this.context.commit("setErrors", response.errors);
            this.context.commit("toggleIndicator", "creatingRole");
        } catch(error) {
            this.context.commit("toggleIndicator", "creatingRole");
            this.context.commit("setErrors", {server: "Failed to reached server"});
            console.error(error);
        }
    }

    @Action
    async updateRole(role: IRole) {
        this.context.commit("toggleIndicator", "updatingRole");
        try {
            var response = await http.getJson("", {
                id: role.id,
                definition: role.definition,
            }, "PATCH");
            if(response.status)
                this.context.commit("alterRole", response.data);
            else this.context.commit("setErrors", response.errors);
            this.context.commit("toggleIndicator", "updatingRole");
        } catch(error) {
            this.context.commit("toggleIndicator", "updatingRole");
            this.context.commit("setErrors", {server: "Failed to reached server"});
            console.error(error);
        }
    }

    @Action
    async deleteRole(role: IRole) {
        this.context.commit("toggleIndicator", "deletingRole");
        try {
            var response = await http.getJson("", {
                id: role.id
            }, "DELETE");
            if(response.status)
                this.context.commit("removeRole", role);
            else this.context.commit("setErrors", response.errors);
            this.context.commit("toggleIndicator", "deletingRole");
        } catch(error) {
            this.context.commit("toggleIndicator", "deletingRole");
            this.context.commit("setErrors", {server: "Failed to reached server"});
            console.error(error);
        }
    }

    @Action
    async getRole(definition: string) {
        this.context.commit("toggleIndicator", "gettingRole");
        try {
            var response = await http.getJson("", {
                definition
            }, "GET")
            if(response.status)
                this.context.commit("setCurrentRole", response.data)
            else this.context.commit("setErrors", response.errors);
            this.context.commit("toggleIndicator", "gettingRole");
        } catch(error) {
            this.context.commit("toggleIndicator", "gettingRole");
            this.context.commit("setErrors", {server: "Failed to reached server"});
            console.error(error);
        }
    }

    @Action
    async getRoles(query: string, refresh: boolean = false) {
        this.context.commit("toggleIndicator", "loadingRole");
        try {
            var response = await http.getJson("", {
                query,
                page: this.page
            }, "GET")
            if(response.status)
                this.context.commit("setRoles", {
                    roles: response.data,
                    hasNextPage: response.hasNextPage,
                    refresh
                })
            else this.context.commit("setErrors", response.errors);
            this.context.commit("toggleIndicator", "loadingRole");
        } catch(error) {
            this.context.commit("toggleIndicator", "loadingRole");
            this.context.commit("setErrors", {server: "Failed to reached server"});
            console.error(error);
        }
    }

}
