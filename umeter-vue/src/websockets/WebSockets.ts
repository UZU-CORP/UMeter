export class WebSocketObservable extends WebSocket{
    private observers!: Map<string, WebSocketObserver[]>;
    private static instance: WebSocketObservable;

    onopen = (event: Event) => {
        console.log("websocket opened");
    }

    onerror = (event: Event) => {
        console.error("websocket error:", event);
    }

    onclose = (event: Event) => {
        console.log("websocket closed");
    }

    onmessage = (event: MessageEvent) => {
        this.notifyObservers(JSON.parse(event.data) as IWebSocketJsonMessage);
    }

    private constructor(url: string, protocols: string | string[] | undefined = undefined) {
        super(url, protocols);
        this.observers = new Map<string, WebSocketObserver[]>();
    }

    static getInstance(url: string, protocols: string | string[] | undefined = undefined): WebSocketObservable {
        if(this.instance == null)
            this.instance = new WebSocketObservable(url, protocols);
        return this.instance;
    }

    addObserver<K extends WebSocketObserver>(observer: K) {
        var temp = this.observers.get(observer.key);
        if(temp === undefined){
            temp = [observer];
            this.observers.set(observer.key, temp);
        }
        else temp.push(observer);
    }

    removeObserver<K extends WebSocketObserver>(observer: K) {
        var temp = this.observers.get(observer.key)?.filter(value => value != observer) || [];
        this.observers.set(observer.key, temp);
    }

    notifyObservers(message: IWebSocketJsonMessage) {
        var temp = this.observers.get(message.key) || [];
        temp.forEach(observer => new Promise((resolve, reject) => resolve(observer.notify(message))));
    }
}

export abstract class WebSocketObserver {
    private _key: string;

    constructor(key: string) {
        this._key = key;
    }

    get key(){return this._key;}

    abstract notify(message: IWebSocketJsonMessage): void;
}