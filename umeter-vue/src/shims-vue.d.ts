declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare function toast(toatObject: IToastObject): void
declare function toast(toatObject: boolean): void
declare function confirm(confirmObject: IConfirmObject): {then: (resolve: (value: boolean) => any, reject?: (reason: any) => any) => void};
declare function authenticate(message?: string): {then: (resolve: () => any, reject?: (reason: any) => any) => void};