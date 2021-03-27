import {DiscrepancyType} from '../enums/discrepancy-type.enum';
import {FuelType} from '../enums/fuel-type.enum';

export interface TankFilling {
  tankFillingId: number;
  kmBefore: number;
  kmAfter?: number;
  discrepancy: boolean;
  discrepancyType: DiscrepancyType;
  dateTimeFilling: Date;
  fuelType: FuelType;
  liters: number;
  consumption: number;
  correctionForId?: number;
  correctedById?: number;
  plateNumber: string;
}
