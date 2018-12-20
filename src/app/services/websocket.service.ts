import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { Observable, Subscriber, timer } from "rxjs";

@Injectable()
export class WebsocketService {

  private ws: WebSocket;
  private readonly obs: Observable<string>;
  _obs: Subscriber<string> = null;

  constructor() {
    timer(1000, 2500)
      .subscribe(() => {
        if (this.isConnected()) {
          this.send({action: "PING", data: Date.now()});
        } else {
          if (this.getConnectionStatus() == WebSocket.CLOSED) {
            try {
              this.connect();
            } catch (e) {
              console.error(e);
            }
          }
        }
      });

    this.obs = new Observable(observer => this._obs = observer);

    window.onunload = () => {
      this.close();
    };
  }

  getConnectionStatus(): number {
    return this.ws ? this.ws.readyState : WebSocket.CLOSED;
  }

  isConnected(): boolean {
    return this.ws ? this.ws.readyState == WebSocket.OPEN : false;
  }

  connect(): Observable<string> {
    if (!this.isConnected()) {
      if (environment.websocketUrl) {
        this.ws = new WebSocket("ws://" + environment.websocketUrl + "/websocket");
        this.ws.onmessage = (event) => {
          try {
            let jsonData = JSON.parse(event.data);
            this._obs.next(jsonData);
          } catch (e) {
            console.error(e);
          }
        };
      }
    }
    return this.getData();
  }

  getData(): Observable<string> {
    return this.obs;
  }

  close(): void {
    if (this.isConnected()) {
      this.ws.close();
    }
  }

  send(json: WebsocketMessage): void {
    if (this.isConnected()) {
      this.ws.send(JSON.stringify(json));
    }
  }
}

export interface WebsocketMessage {
  action: string
  data: any
}
