import { ElementRef, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface MicroFrontend {
  elementRef: ElementRef;
}

@Injectable({
  providedIn: 'root'
})
export class MicroFrontendService {

  private parentURI: string = '';
  private microFrontends: MicroFrontend[] = [];
  private onMessage$: Subject<any> = new Subject();

  constructor() { }

  private initOnMessageEvent(): void {
    window.onmessage = (event: any) => {
      if (
        (this.parentURI === event.origin) ||
        (this.findMicroFrontendByOrigin(event.origin))
      ) {
        this.onMessage$.next(event.data);
      }
    }
  }

  private findMicroFrontendByOrigin(origin: string): MicroFrontend | undefined {
    return this.microFrontends.find((mf, index) => mf?.elementRef?.nativeElement?.getAttribute('src') === origin);
  }

  private findMicroFrontendByName(name: string): MicroFrontend | undefined {
    return this.microFrontends.find((mf, index) => mf?.elementRef?.nativeElement?.getAttribute('name') === name);
  }

  public init(parentURI: string = ''): void {
    this.parentURI = parentURI;
    this.initOnMessageEvent();
  }

  public addMicroFrontend(microFrontend: MicroFrontend): void {
    this.microFrontends.push(microFrontend);
  }

  public sendMessageToChild(name: string, message: any): void {
    const mf = this.findMicroFrontendByName(name);
    if (mf) {
      const src = mf?.elementRef?.nativeElement?.getAttribute('src');
      mf.elementRef.nativeElement.contentWindow?.postMessage(message, src);
    }
  }

  public sendMessageToParent(message: any): void {
    parent.postMessage(message, this.parentURI);
  }

  public getOnMessageObservable(): Observable<any> {
    return this.onMessage$.asObservable();
  }
}

/**
 * Registrar log de mensajes, fecha y hora, emisor y receptor ¿datos?
 * Enviar mensaje a un hermano ¿abuelo, nieto?
 * Ver elementos de mayor proteccion
 * Probar en urls reales con dominios distintos
 * ¿Ping Pong? respuesta silenciosa para confirmar recepción de mensaje? reintentos?
 */
