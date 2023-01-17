import { ElementRef, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface MicroFrontend {
  elementRef: ElementRef;
}

export interface MicroFrontendMessage {
  data: {
    location: Location;
  }
  message: any;
}

export interface MicroFrontendSharedData {
  host: string;
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class MicroFrontendService {
  private host: string = window.location.host;
  private parentURIs: string[] = [];
  private microFrontends: MicroFrontend[] = [];
  private onMessage$: Subject<any> = new Subject();
  private sharedData: MicroFrontendSharedData = {
    host: this.host,
    data: {}
  };
  private globalSharedData: MicroFrontendSharedData[] = [this.sharedData];

  constructor() {}

  private initOnMessageEvent(): void {
    window.onmessage = (event: any) => {
      if (
        (this.findParentURIByOrigin(event.origin)) ||
        (this.findMicroFrontendByOrigin(event.origin))
      ) {
        const incomingSharedData = event?.data?.message?.sharedData;
        if (incomingSharedData) {
          // Update globalSharedData
          console.log(incomingSharedData);
          this.updateGlobalSharedDataWithIncomingSharedData(incomingSharedData)
        } else {
          this.onMessage$.next(event);
        }
      }
    }
  }

  private findParentURIByOrigin(origin: string): string | undefined {
    return this.parentURIs.find((parentURI, index) => parentURI === origin);
  }

  private findMicroFrontendByOrigin(origin: string): MicroFrontend | undefined {
    return this.microFrontends.find((mf, index) => mf?.elementRef?.nativeElement?.getAttribute('src') === origin);
  }

  private findMicroFrontendByName(name: string): MicroFrontend | undefined {
    return this.microFrontends.find((mf, index) => mf?.elementRef?.nativeElement?.getAttribute('name') === name);
  }

  private messageCustomData(message: any): MicroFrontendMessage {
    return {
      data: {
        location: JSON.parse(JSON.stringify(window.location)),
      },
      message
    }
  }

  private updateGlobalSharedDataWithOwnSharedData(): void {
    const globalSharedDataHasSharedData = this.globalSharedData.find((sharedData) => sharedData.host === this.host);
    if (!globalSharedDataHasSharedData) {
      this.globalSharedData.push(this.sharedData);
    } else {
      this.globalSharedData = this.globalSharedData.map((sharedData) => {
        if (sharedData.host === this.host) {
          return this.sharedData;
        } else {
          return sharedData;
        }
      });
    }
    this.sendGlobalSharedDataToAllChilds();
    this.sendGlobalSharedDataToAllParents();
  }

  private updateGlobalSharedDataWithIncomingSharedData(incomingSharedData: MicroFrontendSharedData): void {
    const globalSharedDataHasSharedData = this.globalSharedData.find((sharedData) => sharedData.host === incomingSharedData.host);
    if (!globalSharedDataHasSharedData) {
      this.globalSharedData.push(incomingSharedData);
    } else {
      this.globalSharedData = this.globalSharedData.map((sharedData) => {
        if (sharedData.host === incomingSharedData.host) {
          return incomingSharedData;
        } else {
          return sharedData;
        }
      });
    }
  }

  private sendGlobalSharedDataToAllChilds(): void {
    this.sendMessageToAllChilds({sharedData: this.sharedData});
  }

  private sendGlobalSharedDataToAllParents(): void {
    this.sendMessageToAllParents({sharedData: this.sharedData});
  }

  /*
  Config
  */

  public init(parentURIs: string[] = []): void {
    this.parentURIs = parentURIs;
    this.initOnMessageEvent();
  }

  public addMicroFrontend(microFrontend: MicroFrontend): void {
    this.microFrontends.push(microFrontend);
  }

  public getOnMessageObservable(): Observable<any> {
    return this.onMessage$.asObservable();
  }

  /*
  Child communication
  */

  public sendMessageToChild(name: string, message: any): void {
    const mf = this.findMicroFrontendByName(name);
    if (mf) {
      const src = mf?.elementRef?.nativeElement?.getAttribute('src');
      mf.elementRef.nativeElement.contentWindow?.postMessage(this.messageCustomData(message), src);
    }
  }

  public sendMessageToAllChilds(message: any): void {
    this.microFrontends.map((mf) => {
      const src = mf?.elementRef?.nativeElement?.getAttribute('src');
      if (src) {
        mf.elementRef.nativeElement.contentWindow?.postMessage(this.messageCustomData(message), src);
      }
    });
  }

  /*
  Parent communication
  */

  public sendMessageToParent(uri: string, message: any): void {
    const findParentURI = this.parentURIs.find((parentURI) => parentURI === uri);
    if (findParentURI) {
      parent.postMessage(this.messageCustomData(message), findParentURI);
    }
  }

  public sendMessageToAllParents(message: any): void {
    this.parentURIs.map((uri) => {
      if (uri) {
        parent.postMessage(this.messageCustomData(message), uri);
      }
    });
  }

  /*
  Shared data
  */

  public getGlobalSharedData(): MicroFrontendSharedData[] {
    return this.globalSharedData;
  }

  public getSharedData(): MicroFrontendSharedData {
    return this.sharedData;
  }

  public setSharedData(key: string, value: any): void {
    const data = this.sharedData.data;
    data[key] = value;
    this.sharedData = {
      host: this.host,
      data
    }
    this.updateGlobalSharedDataWithOwnSharedData();
  }

  public deleteAllSharedData(): void {
    this.sharedData.data = {};
    this.updateGlobalSharedDataWithOwnSharedData();
  }

  /*
  Brother communication (talk with father first and father with brother)

  sendMessageToBrother(name: string, message: any): void {}
  */

  /*
  Family communication 
  sendMessageToAllFamily(name: string, message: any): void {}
  */
}

/**
 * Registrar log de mensajes, fecha y hora, emisor y receptor ¿datos?
 * Enviar mensaje a un hermano ¿abuelo, nieto?
 * Ver elementos de mayor proteccion
 * Probar en urls reales con dominios distintos
 * ¿Ping Pong? respuesta silenciosa para confirmar recepción de mensaje? reintentos?
 */
