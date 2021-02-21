import {Car} from './car.model';

export interface Inspection {
  carInspectionId: number;
  inspectionDate: Date;
  sentDate?: Date;
  expertisedBy: string;
  damaged: boolean;
  picturesFolder: string;
  inspectionReportFile: string;
  car: Car;
}

