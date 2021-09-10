import { Pipe, PipeTransform } from '@angular/core';
import {LeasingCompany} from '../models/leasing-company.model';
import {BelgianPhoneNumberPipe} from './belgian-phone-number.pipe';

@Pipe({
  name: 'leasingTooltip'
})
export class LeasingTooltipPipe implements PipeTransform {

  constructor(private belgianPhoneNumber: BelgianPhoneNumberPipe) {
  }

  transform(value: LeasingCompany, ...args: unknown[]): unknown {
    const phone = this.belgianPhoneNumber.transform(value.leasingCompanyPhone);
    return `${value.leasingCompanyEmail}\n${value.leasingCompanyContactPerson}\n${phone}\n(Copy e-mail)`;
  }

}
