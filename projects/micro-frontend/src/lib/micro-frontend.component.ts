import { Component, OnInit } from '@angular/core';
import { MicroFrontendService } from './micro-frontend.service';

@Component({
  selector: 'lib-micro-frontend',
  template: `
    <p>
      micro-frontend works!!!
    </p>
  `,
  styles: [
  ]
})
export class MicroFrontendComponent implements OnInit {

  constructor(public microFrontendSrv: MicroFrontendService) { }

  ngOnInit(): void {
  }

}
