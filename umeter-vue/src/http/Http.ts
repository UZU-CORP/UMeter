export interface Settings {
    headers: {[key: string]: any};
    base?: string;
    withCredentials?: boolean;
    cors?: boolean;
}

export interface RequestObject {
    url: string;
    method?: string;
    headers?: {[key: string]: any};
    timeout?: number;
    content?: FormData | string;
}

export class JsonXMLHttpRequest extends XMLHttpRequest {
    public xml() {
        return this.responseXML
    }

    public json(): IJsonResponse {
        var response = JSON.parse(this.responseText);
        return {
            status: response.status,
            errors: response.errors,
            data: response.data,
            hasNextPage: response.next_page != null || parseInt(response.next_page) > 0,
            nextPage: response.next_page,
            previousPage: response.previous_page,
            numberOfPages: response.number_of_pages
        }
    }
}

export class Http {
    public global: Settings;

    constructor(global: Settings) {
        this.global = global
    }

    createXHR(method: string, url: string): JsonXMLHttpRequest {
        const xhr = new JsonXMLHttpRequest()
        if (xhr) {
            xhr.open(method || 'GET', `${this.global.base || "" + url}`)
            for (const header in this.global.headers) {
                xhr.setRequestHeader(header, this.global.headers[header].constructor === Function ? this.global.headers[header]() : this.global.headers[header])
            }
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
            xhr.withCredentials = this.global.withCredentials == true
        }
        return xhr
    }

    request(requestObject: RequestObject): Promise<JsonXMLHttpRequest> {
        return new Promise((resolve, reject) => {
            const xhr = this.createXHR(requestObject.method || 'GET', requestObject.url)
            for (const header in requestObject.headers) {
                xhr.setRequestHeader(header, requestObject.headers[header].constructor == Function ? requestObject.headers[header]() : requestObject.headers[header])
            }
            if (!this.global.cors) {
                xhr.setRequestHeader('cache-control', 'no-cache')
            }
            xhr.timeout = requestObject.timeout || 300000
            xhr.ontimeout = () => {
                return reject(Error('The connection timed out. Please try again.'))
            }
            xhr.onerror = (e) => {
                return reject(Error('An Error occured!' + e))
            }
            try {
                xhr.send(requestObject.content)
            } catch (e) {
                reject(Error('Request failed! ' + e))
            }
            xhr.onload = () => resolve(xhr)
        })
    }

    post(url: string, params: {[key: string]: any}, contentType = '', timeout = 15000) {
        if (contentType == 'application/json') {
            const content = JSON.stringify(params)
            const headers = { 'Content-Type': contentType }
            return this.request({
                url,
                method: 'POST',
                content,
                headers,
                timeout
            })
        } else {
            const content = new FormData()
            for (const param in params) { content.append(param, params[param]) }
            const headers = {}
            return this.request({
                url,
                method: 'POST',
                content,
                headers,
                timeout
            })
        }
    }

    get(url: string, params: {[key: string]: any} = {}) {
        let query = ''
        for (const param in params) {
            query += `&${param}=${escape(params[param])}`
        }
        query = query.substring(1)
        return this.request(
            {
                url: `${url}?${query}`,
                method: 'GET',
                content: '',
                headers: {},
                timeout: 1500
            })
    }

    getJson(url: string, params: {[key: string]: any} = {}, method = 'GET', contentType = ''): Promise<IJsonResponse> {
        if (method == 'POST') {
            return this.post(url, params, contentType).then(response => response.json())
        }
        return this.get(url, params).then(response => response.json())
    }
}
