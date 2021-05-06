import {FuelType} from '../enums/fuel-type.enum';
import {Brand} from '../enums/brand.enum';
import {LeasingCompany} from './leasing-company.model';
import {StaffMember} from './staff-member.model';
import {Inspection} from './inspection.model';

export interface Car {
  plateNumber: string;
  kilometers: number;
  brand: Brand;
  model: string;
  fuelType: FuelType;
  averageConsumption: number;
  startDate: Date;
  endDate?: Date;
  ongoing: boolean;
  freeText?: string;
  leasingCompany: LeasingCompany;
  leasingCompanyId: number;
  staffMember: StaffMember;
  staffMemberId: number;
  inspection: Inspection;
}
