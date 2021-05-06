import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'BelgianPhoneNumber'
})
export class BelgianPhoneNumberPipe implements PipeTransform {

  transform(value: string, ...args: any[]): any {
    return value.length === 9 ?
      value.substr(0, 3) + ' '
      + value.substr(3, 2) + ' '
      + value.substr(5, 2) + ' '
      + value.substr(7)
      : value.substr(0, 4) + ' '
      + value.substr(4, 2) + ' '
      + value.substr(6, 2) + ' '
      + value.substr(8);
  }

}
