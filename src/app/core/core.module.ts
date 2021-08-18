import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {HttpClientModule} from '@angular/common/http';

/**
 * Core module is loaded once by bootstrap component (app)
 */

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule
  ],
  exports: []
})
export class CoreModule { }
