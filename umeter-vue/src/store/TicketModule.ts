import {Module, VuexModule, Action, Mutation} from "vuex-module-decorators";
import http from "@/plugins/http";

@Module
export default class TicketModule extends VuexModule {
    ticket: ITicket[] = [];
    currentTicket!: ITicket;
    page: number = 1;
    hasNextPage: boolean = false;

    indicators: {[key: string]: boolean} = {
        creatingTicket: false,
        updatingTicket: false,
        deletingTicket: false,
        loadingTickets: false,
        gettingTicket: false,
    };

    @Mutation
    toggleIndicator(name: string) {
        this.indicators[name] = !this.indicators[name];
    }

    @Mutation
    addTicket(ticket: ITicket) {
        this.ticket = [
            ticket,
            ...this.ticket
        ]
    }

    @Mutation
    alterTicket(ticket: ITicket) {
        this.ticket.forEach((value: ITicket, index: number) => {
            if(ticket.id == value.id)
                this.ticket[index] = ticket;
        })
    }

    @Mutation
    removeTicket(ticket: ITicket) {
        this.ticket = this.ticket.filter((value: ITicket) => ticket.id != value.id);
    }

    @Mutation
    setCurrentTicket(ticket: ITicket) {
        this.currentTicket = ticket;
    }

    @Mutation
    setTickets(payload: {ticket: ITicket[], refresh: boolean, hasNextPage: boolean}) {
        if(payload.refresh) {
            this.page = 1;
            this.ticket = payload.ticket;
        }
        else {
            this.page++;
            this.ticket.push(...payload.ticket);
        }
    }

    @Action
    async createTicket(ticket: ITicket) {
        this.context.commit("toggleIndicator", "creatingTicket");
        try {
            var response = await http.getJson("", {
                ...ticket
            }, "POST");
            if(response.status)
                this.context.commit("addTicket", response.data);
            else this.context.commit("setErrors", response.errors);
            this.context.commit("toggleIndicator", "creatingTicket");
        } catch(error) {
            this.context.commit("toggleIndicator", "creatingTicket");
            this.context.commit("setErrors", {server: "Failed to reached server"});
            console.error(error);
        }
    }

    @Action
    async updateTicket(ticket: ITicket) {
        this.context.commit("toggleIndicator", "updatingTicket");
        try {
            var response = await http.getJson("", {
                ...ticket
            }, "PATCH");
            if(response.status)
                this.context.commit("alterTicket", response.data);
            else this.context.commit("setErrors", response.errors);
            this.context.commit("toggleIndicator", "updatingTicket");
        } catch(error) {
            this.context.commit("toggleIndicator", "updatingTicket");
            this.context.commit("setErrors", {server: "Failed to reached server"});
            console.error(error);
        }
    }

    @Action
    async deleteTicket(ticket: ITicket) {
        this.context.commit("toggleIndicator", "deletingTicket");
        try {
            var response = await http.getJson("", {
                id: ticket.id
            }, "DELETE");
            if(response.status)
                this.context.commit("removeTicket", ticket);
            else this.context.commit("setErrors", response.errors);
            this.context.commit("toggleIndicator", "deletingTicket");
        } catch(error) {
            this.context.commit("toggleIndicator", "deletingTicket");
            this.context.commit("setErrors", {server: "Failed to reached server"});
            console.error(error);
        }
    }

    @Action
    async getTicket(id: number) {
        this.context.commit("toggleIndicator", "gettingTicket");
        try {
            var response = await http.getJson("", {
                id
            }, "GET")
            if(response.status)
                this.context.commit("setCurrentTicket", response.data)
            else this.context.commit("setErrors", response.errors);
            this.context.commit("toggleIndicator", "gettingTicket");
        } catch(error) {
            this.context.commit("toggleIndicator", "gettingTicket");
            this.context.commit("setErrors", {server: "Failed to reached server"});
            console.error(error);
        }
    }

    @Action
    async getTickets(query: string, refresh: boolean = false) {
        this.context.commit("toggleIndicator", "loadingTickets");
        try {
            var response = await http.getJson("", {
                query,
                page: this.page
            }, "GET")
            if(response.status)
                this.context.commit("setTickets", {
                    ticket: response.data,
                    hasNextPage: response.hasNextPage,
                    refresh
                })
            else this.context.commit("setErrors", response.errors);
            this.context.commit("toggleIndicator", "loadingTickets");
        } catch(error) {
            this.context.commit("toggleIndicator", "loadingTickets");
            this.context.commit("setErrors", {server: "Failed to reached server"});
            console.error(error);
        }
    }

}