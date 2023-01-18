import { Component, ElementRef, Host, ViewChild } from '@angular/core';
import { MicroFrontendComponent, MicroFrontendService } from '../../dist/micro-frontend';

enum Hosts {
  father = 'http://localhost:4200',
  child = 'http://localhost:4201',
  child2 = 'http://localhost:4202'
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('microFrontendLibComponent') microFrontendLibComponent!: MicroFrontendComponent;
  @ViewChild('child') iframeChild!: ElementRef;
  @ViewChild('child2') iframeChild2!: ElementRef;

  hosts = Hosts;
  currentOrigin: string = window.location.origin;

  constructor(private microFrontendSrv: MicroFrontendService) {}

  ngAfterViewInit(): void {
    if (this.currentOrigin === Hosts.father) {
      this.microFrontendLibComponent.addMicroFrontend({elementRef: this.iframeChild});
      this.microFrontendLibComponent.addMicroFrontend({elementRef: this.iframeChild2});
    }
  }
}
