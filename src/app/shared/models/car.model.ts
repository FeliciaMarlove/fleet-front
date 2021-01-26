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
  staffMember: StaffMember;
  inspection: Inspection;
}
