import Vue from "vue";
import http from "@/plugins/http";
import requiredRule from "@/rules/requiredRule";
import requiredLengthRule from "@/rules/requiredLengthRule";
import emailRule from "@/rules/emailRule";
import { Ref } from 'vue-property-decorator';

export default class SignUpMixin extends Vue{
    
    defaultNext!: string;

    email: string = "";
    firstName: string = "";
    lastName: string = "";
    password: string = "";
    signingUp: boolean = false;
    keepSignedIn: boolean = false;
    otherFields: IIndexableObject = {};
    errorMessages: IIndexableObject = {};
    requiredRule = requiredRule;
    emailRule = emailRule;
    requiredLengthRule = requiredLengthRule;

    @Ref() signUpForm!: IIndexableObject;

    constructor() {
        super()
    }

    async signUp(): Promise<IIndexableObject> {
        if (this.signUpForm.validate()){
            try {
                this.signingUp = true;
                var response = await http.getJson(`/accounts/sign-up/?r=${this.keepSignedIn}`, {
                    email: this.email,
                    password: this.password,
                    first_name: this.firstName[0].toUpperCase() + this.firstName.substring(1).toLowerCase(),
                    last_name: this.lastName[0].toUpperCase() + this.lastName.substring(1).toLowerCase(),
                    ...this.otherFields
                }, "POST");
                this.signingUp = false;
                if (!response.status)
                    this.errorMessages = {signUp: response.error};
                this.$router.push(this.defaultNext);
                return response;
            } catch {
                this.errorMessages = {signUp: "Failed to sign up. Please try again"};
                this.signingUp = false;
                return {status: false, error: this.errorMessages};
            }
        }
        return {status: false, error: this.errorMessages};
    }

}