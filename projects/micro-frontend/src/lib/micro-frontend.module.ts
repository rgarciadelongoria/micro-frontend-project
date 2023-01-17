import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MicroFrontendComponent } from './micro-frontend.component';



@NgModule({
  declarations: [
    MicroFrontendComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    MicroFrontendComponent
  ]
})
export class MicroFrontendModule { }
