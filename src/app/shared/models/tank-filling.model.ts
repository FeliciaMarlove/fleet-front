import {Car} from './car.model';

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
  car: Car;
}
