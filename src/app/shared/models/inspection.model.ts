import {StaffMember} from './staff-member.model';
import {Car} from './car.model';

export interface Inspection {
  carInspectionId: number;
  inspectionDate: Date;
  sentDate?: Date;
  expertisedBy: string;
  damaged: boolean;
  picturesFolder: string;
  inspectionReportFile: string;
  plateNumber: string;
  staffMemberId: number;
  staffMember: StaffMember;
  car: Car;
}

