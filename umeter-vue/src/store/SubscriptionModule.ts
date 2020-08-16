import {Module, VuexModule, Action} from "vuex-module-decorators";
import http from '@/plugins/http';

@Module
export default class SubscriptionModule extends VuexModule {

    @Action
    async createSubscription(subscription: ISubscription): Promise<IJsonResponse> {
        return http.getJson("", {
            ...subscription
        }, "POST");
    }

    @Action
    async updateSubscription(subscription: ISubscription): Promise<IJsonResponse> {
        return http.getJson("", {
            ...subscription
        }, "PATCH")
    }

    @Action
    async deleteSubscription(id: number): Promise<IJsonResponse> {
        return http.getJson("", {
            id
        }, "DELETE");
    }

    @Action
    async getSubscriptions(query: string, page: number): Promise<IJsonResponse> {
        return http.getJson("", {
            query,
            page
        }, "GET")
    }

    @Action
    async getSubscription(id: number): Promise<IJsonResponse> {
        return http.getJson("", {
            id
        }, "GET");
    }

    @Action
    async createInvoice(subscription: ISubscription, ): Promise<IJsonResponse> {
        return http.getJson("", {
            ...subscription
        }, "POST")
    }

}