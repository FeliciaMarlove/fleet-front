import {Car} from './car.model';

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
