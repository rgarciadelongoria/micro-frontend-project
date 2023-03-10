import { Component, Input, OnInit } from '@angular/core';
import { MicroFrontend, MicroFrontendService } from './micro-frontend.service';

@Component({
  selector: 'lib-micro-frontend',
  templateUrl: './micro-frontend.component.html',
  styleUrls: ['./micro-frontend.component.scss']
})
export class MicroFrontendComponent implements OnInit {
  @Input() parentURIs: string[] = [];

  public events: MessageEvent[] = [];
  public exampleText: string = '';

  constructor(public microFrontendSrv: MicroFrontendService) { }

  ngOnInit(): void {
    this.microFrontendSrv.init(this.parentURIs);
    this.microFrontendSrv.getOnMessageObservable().subscribe((message: any) => this.onMessage(message));
  }

  private onMessage(e: MessageEvent): void {
    this.events.push(e);
  }

  public getClass(): string {
    if (this.microFrontendSrv.getParentURIs().length && 
      this.microFrontendSrv.getMicroFrontends().length) {
      return 'father-child';
    } else if (this.microFrontendSrv.getParentURIs().length) {
      return 'child';
    } else if (this.microFrontendSrv.getMicroFrontends().length) {
      return 'father';
    } else {
      return '';
    }
  }

  public addMicroFrontend(microFrontend: MicroFrontend): void {
    this.microFrontendSrv.addMicroFrontend(microFrontend);
  }

  public sendMessageToAllParents(): void {
    this.microFrontendSrv.sendMessageToAllParents({exampleText: this.exampleText});
  }

  public sendMessageToAllChilds(): void {
    this.microFrontendSrv.sendMessageToAllChilds({exampleText: this.exampleText});
  }

  public setSharedData(): void {
    this.microFrontendSrv.setSharedData(this.exampleText, {'exampleText': this.exampleText});
  }

  public deleteAllSharedData(): void {
    this.microFrontendSrv.deleteAllSharedData();
  }

  public deleteSharedData(): void {
    this.microFrontendSrv.deleteSharedData(this.exampleText);
  }
}
