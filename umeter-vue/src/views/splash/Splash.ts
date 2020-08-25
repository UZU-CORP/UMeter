import  {Vue, Component} from "vue-property-decorator";

@Component
export default class Splash extends Vue {
    mounted() {
        setTimeout(() => this.$router.replace("/home"), 2000)
    }
}