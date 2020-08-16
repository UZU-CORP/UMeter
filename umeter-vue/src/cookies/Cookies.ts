class Cookies {
    private cookieObject: Map<string, string> = new Map();

    constructor () {
      this.load()
    }

    get (cookie: string): string {
      this.load()
      return this.cookieObject.get(cookie) || ''
    }

    set (cookie: string, value: string) {
      this.cookieObject.set(cookie, value)
      document.cookie = `${cookie}=${value}`
    }

    load () {
      const temp = document.cookie.split('; ')
      for (let i in temp) {
        i = temp[i]
        const [name, value] = i.split('=')
        this.cookieObject.set(name, value)
      }
    }
}

export default Cookies
