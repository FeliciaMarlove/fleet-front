import {Car} from './car.model';

export interface Inspection {
  carInspectionId: number;
  inspectionDate: Date;
  sentDate?: Date;
  expertisedBy: string;
  damaged: boolean;
  picture1?: File;
  picture2?: File;
  picture3?: File;
  inspectionReport?: File;
  car: Car;
}

