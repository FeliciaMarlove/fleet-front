import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'BelgianPhoneNumber'
})
export class BelgianPhoneNumberPipe implements PipeTransform {

  transform(value: string, ...args: any[]): any {
    return value.substr(0, 3) + ' '
      + value.substr(3, 2) + ' '
      + value.substr(5, 2) + ' '
      + value.substr(7);
  }

}
