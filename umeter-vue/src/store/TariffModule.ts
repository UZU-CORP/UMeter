import {Module, VuexModule, Action} from "vuex-module-decorators";
import http from '@/plugins/http';

@Module
export default class TariffModule extends VuexModule {

    @Action
    async createTariff(tariff: ITariff): Promise<IJsonResponse> {
        return http.getJson("", {
            ...tariff
        }, "POST");
    }

    @Action
    async updateTariff(tariff: ITariff): Promise<IJsonResponse> {
        return http.getJson("", {
            ...tariff
        }, "PATCH")
    }

    @Action
    async deleteTariff(id: number): Promise<IJsonResponse> {
        return http.getJson("", {
            id
        }, "DELETE");
    }

    @Action
    async getTariffs(query: string, page: number): Promise<IJsonResponse> {
        return http.getJson("", {
            query,
            page
        }, "GET")
    }

    @Action
    async getTariff(id: number): Promise<IJsonResponse> {
        return http.getJson("", {
            id
        }, "GET");
    }
}