import { Pipe, PipeTransform } from '@angular/core';
import {FuelType} from '../enums/fuel-type.enum';

@Pipe({
  name: 'fuelDisplay'
})
export class FuelDisplayPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    switch (value) {
      case 'DIESEL': return FuelType.DIESEL;
      case 'GASOLINE': return FuelType.GASOLINE;
      case 'HYBRID_GASOLINE': return FuelType.HYBRID_GASOLINE;
      case 'HYBRID_DIESEL': return FuelType.HYBRID_DIESEL;
      case 'FULL_ELECTRIC': return FuelType.FULL_ELECTRIC;
    }
    return null;
  }

}
