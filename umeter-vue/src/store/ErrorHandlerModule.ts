import {Module, VuexModule, Mutation} from "vuex-module-decorators";

@Module
export default class ErrorHandlerModule extends VuexModule {
    errors: {[state: string]: string} = {}

    @Mutation
    setErrors(errors: {[state: string]: string}) {
        this.errors = errors;
        for(var errorName in this.errors)
            console.error(this.errors[errorName]);
        if(this.errors["server"] != null)
            toast({icon: "mdi-exclamation-thick", iconColor: "red", message: this.errors["server"]});
    }
}