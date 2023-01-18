import { ElementRef, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface MicroFrontend {
  elementRef: ElementRef;
}

export interface MicroFrontendMessage {
  mf: boolean;
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
  private sharedData: MicroFrontendSharedData = {host: this.host, data: {}};
  private globalSharedData: MicroFrontendSharedData[] = [];

  constructor() {}

  private initOnMessageEvent(): void {
    window.onmessage = (event: any) => {
      if (this.hasCorrectOrigin(event)) {
        const incomingSharedData = event?.data?.message?.sharedData; // Child to parent
        const incomingGlobalSharedData = event?.data?.message?.globalSharedData; // Parent to child
        if (incomingSharedData) {
          this.updateGlobalSharedDataWithIncomingSharedData(incomingSharedData);
        } else if (incomingGlobalSharedData) {
          this.updateGlobalSharedDataWithIncomingGlobalSharedData(incomingGlobalSharedData);
        } else {
          this.onMessage$.next(event);
        }
      }
    }
  }

  private hasCorrectOrigin(event: any): boolean {
    return (event.data?.mf) && // only events with mf: true
    ((this.findParentURIByOrigin(event.origin)) ||
    (this.findMicroFrontendByOrigin(event.origin)));
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

  private addMessageCustomData(message: any): MicroFrontendMessage {
    return {
      mf: true,
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
    this.sendSharedDataToAllParents(incomingSharedData);
    this.sendGlobalSharedDataToAllChilds();
  }

  private updateGlobalSharedDataWithIncomingGlobalSharedData(incomingGlobalSharedData: MicroFrontendSharedData[]): void {
    this.globalSharedData = incomingGlobalSharedData;
    this.sendGlobalSharedDataToAllChilds();
  }

  private sendGlobalSharedDataToAllChilds(): void {
    this.sendMessageToAllChilds({globalSharedData: this.globalSharedData});
  }

  private sendSharedDataToAllParents(sharedData?: MicroFrontendSharedData): void {
    this.sendMessageToAllParents({sharedData: (sharedData) ? sharedData : this.sharedData});
  }

  /*
  Config
  */

  public init(parentURIs: string[] = [], microFrontends: MicroFrontend[] = []): void {
    this.parentURIs = parentURIs;
    this.microFrontends = microFrontends;
    this.initOnMessageEvent();
    this.updateGlobalSharedDataWithOwnSharedData();
    this.sendSharedDataToAllParents();
  }

  public addMicroFrontend(microFrontend: MicroFrontend): void {
    this.microFrontends.push(microFrontend);
  }

  public addParentURI(parentURI: string): void {
    this.parentURIs.push(parentURI);
  }

  public getOnMessageObservable(): Observable<any> {
    return this.onMessage$.asObservable();
  }

  /*
  Info
  */

  public getHost(): string {
    return this.host;
  }

  public getParentURIs(): string[] {
    return this.parentURIs;
  }

  public getMicroFrontends(): MicroFrontend[] {
    return this.microFrontends;
  }

  /*
  Child communication
  */

  public sendMessageToChild(name: string, message: any): void {
    const mf = this.findMicroFrontendByName(name);
    if (mf) {
      const src = mf?.elementRef?.nativeElement?.getAttribute('src');
      mf.elementRef.nativeElement.contentWindow?.postMessage(this.addMessageCustomData(message), src);
    }
  }

  public sendMessageToAllChilds(message: any): void {
    this.microFrontends.map((mf) => {
      const src = mf?.elementRef?.nativeElement?.getAttribute('src');
      if (src) {
        mf.elementRef.nativeElement.contentWindow?.postMessage(this.addMessageCustomData(message), src);
      }
    });
  }

  /*
  Parent communication
  */

  public sendMessageToParent(uri: string, message: any): void {
    const findParentURI = this.parentURIs.find((parentURI) => parentURI === uri);
    if (findParentURI) {
      parent.postMessage(this.addMessageCustomData(message), findParentURI);
    }
  }

  public sendMessageToAllParents(message: any): void {
    this.parentURIs.map((uri) => {
      if (uri) {
        parent.postMessage(this.addMessageCustomData(message), uri);
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
    if (this.parentURIs.length) {
      this.sendSharedDataToAllParents();
    } else {
      this.sendGlobalSharedDataToAllChilds();
    }
  }

  public deleteSharedData(key: string): void {
    const data = this.sharedData.data;
    delete data[key];
    this.sharedData = {
      host: this.host,
      data
    }
    this.updateGlobalSharedDataWithOwnSharedData();
    if (this.parentURIs.length) {
      this.sendSharedDataToAllParents();
    } else {
      this.sendGlobalSharedDataToAllChilds();
    }
  }

  public deleteAllSharedData(): void {
    this.sharedData.data = {};
    this.updateGlobalSharedDataWithOwnSharedData();
    if (this.parentURIs.length) {
      this.sendSharedDataToAllParents();
    } else {
      this.sendGlobalSharedDataToAllChilds();
    }
  }
}