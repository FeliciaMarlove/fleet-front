import { Pipe, PipeTransform } from '@angular/core';
import {DiscrepancyType} from '../enums/discrepancy-type.enum';

@Pipe({
  name: 'discrepancyToDisplayName'
})
export class DiscrepancyToDisplayNamePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    switch (value) {
      case 'BEFORE_BIGGER_THAN_AFTER' : return DiscrepancyType.BEFORE_BIGGER_THAN_AFTER;
      case 'QUANTITY_TOO_HIGH' : return DiscrepancyType.QUANTITY_TOO_HIGH;
      case 'WRONG_FUEL' : return DiscrepancyType.WRONG_FUEL;
    }
    return null;
  }

}
