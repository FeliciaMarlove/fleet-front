import { Pipe, PipeTransform } from '@angular/core';
import {Car} from '../models/car.model';

@Pipe({
  name: 'carShortDisplay'
})
export class CarShortDisplayPipe implements PipeTransform {

  transform(value: Car, ...args: any[]): any {
    return value ? value.brand + ' ' + value.model : null;
  }

}
