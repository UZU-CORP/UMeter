import {Vue, Component} from "vue-property-decorator";

@Component
export default class Home extends Vue {
    messageTab: number = 0;
    showDrawer: boolean = false;
    showSignUpDialog: boolean = false;
    showSignInDialog: boolean = false;

    mounted() {
        setInterval(() => this.messageTab = this.messageTab == 0? 1 : 0, 5000)
    }
}