import { Pipe, PipeTransform } from '@angular/core';
import {StaffMember} from '../models/staff-member.model';

@Pipe({
  name: 'staffTooltip'
})
export class StaffTooltipPipe implements PipeTransform {

  transform(value: StaffMember, ...args: unknown[]): unknown {
    return `${value.corporateEmail} (${value.communicationLanguage})`;
  }

}
