import { Pipe, PipeTransform } from '@angular/core';
import {StaffMember} from '../models/staff-member.model';

@Pipe({
  name: 'staffShortDisplay'
})
export class StaffShortDisplayPipe implements PipeTransform {

  transform(value: StaffMember, ...args: any[]): string {
    return value ?
      value.staffFirstName + ' ' + value.staffLastName.toUpperCase()
      : null;
  }
}
