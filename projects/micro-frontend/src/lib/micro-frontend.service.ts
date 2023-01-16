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

@Injectable({
  providedIn: 'root'
})
export class MicroFrontendService {

  /**
   * IMPORTANTE, UN HIJO PUEDE TENER MUCHOS PADRES, HACER QUE FUNCIONE IGUAL QUE CON LOS HIJOS, CON VARIOS PADRES.
   * string -> array de strings
   * se inicializa de forma automatica con los antecesors no hace falta especificar url del padre
   * si se debe poder especificar un array estricto de padres en cuyo caso no se inicializa de forma automática
   * para poder restringuir quien puede o no comunicarse como padre
   */

  private parentURIs: string[] = [''];
  private microFrontends: MicroFrontend[] = [];
  private onMessage$: Subject<any> = new Subject();

  constructor() { }

  private initOnMessageEvent(): void {
    window.onmessage = (event: any) => {
      if (
        (this.findParentURIByOrigin(event.origin)) ||
        (this.findMicroFrontendByOrigin(event.origin))
      ) {
        this.onMessage$.next(event);
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

  public init(parentURIs: string[] = ['']): void {
    this.parentURIs = parentURIs;
    this.initOnMessageEvent();
  }

  public addMicroFrontend(microFrontend: MicroFrontend): void {
    this.microFrontends.push(microFrontend);
  }

  public getOnMessageObservable(): Observable<any> {
    return this.onMessage$.asObservable();
  }

  public sendMessageToChild(name: string, message: any): void {
    const mf = this.findMicroFrontendByName(name);
    if (mf) {
      const src = mf?.elementRef?.nativeElement?.getAttribute('src');
      mf.elementRef.nativeElement.contentWindow?.postMessage(this.messageCustomData(message), src);
    }
  }

  public sendMessageToParent(message: any): void {
    this.parentURIs.map((uri) => {
      parent.postMessage(this.messageCustomData(message), uri);
    });
  }
}

/**
 * Registrar log de mensajes, fecha y hora, emisor y receptor ¿datos?
 * Enviar mensaje a un hermano ¿abuelo, nieto?
 * Ver elementos de mayor proteccion
 * Probar en urls reales con dominios distintos
 * ¿Ping Pong? respuesta silenciosa para confirmar recepción de mensaje? reintentos?
 */
