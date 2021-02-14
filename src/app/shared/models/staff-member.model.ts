import {Car} from './car.model';
import {Language} from '../enums/language.enum';

export interface StaffMember {
  staffMemberId: number;
  staffLastName: string;
  staffFirstName: string;
  hasCar: boolean;
  corporateEmail: string;
  communicationLanguage: Language;
  numberDiscrepancies: number;
  cars: Car[];
}
