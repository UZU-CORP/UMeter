import {Ref, Vue, Prop} from "vue-property-decorator";
import http from "@/plugins/http";
import requiredRule from "@/rules/requiredRule";
import emailRule from "@/rules/emailRule";

export default class SignInMixin extends Vue {

    @Prop() next!: string;

    username: string = "";
    password: string = "";
    keepSignedIn: boolean = false;
    signingIn: boolean = false;
    errorMessages: {[key: string]: any} = {};
    @Ref() signInForm!: {[key: string]: any};
    
    defaultNext!: string;
    requiredRule = requiredRule;
    emailRule = emailRule;
    
    constructor() {
        super()
    }

    async signIn(): Promise<{[key: string]: any}> {
        if (this.signInForm.validate()) {  
            try {
                this.signingIn = true;
                var response = await http.getJson(`/accounts/sign-in/?r=${this.keepSignedIn}`, {username: this.username, password: this.password}, "POST");
                this.signingIn = false;
                if (!response.status)
                    this.errorMessages = {signIn: response.errors};
                else this.$router.push(this.next || this.defaultNext);
                return response;
            } catch {
                this.errorMessages = {signIn: "Failed to sign in. Please try again"};
                this.signingIn = false;
                return {status: false, error: this.errorMessages};
            }
        }
        return {status: false, error: this.errorMessages};
    }
}