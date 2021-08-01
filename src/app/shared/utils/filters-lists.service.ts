import { Injectable } from '@angular/core';

const fillup = {'TO DO': 'WITH_DISCREPANCY_NOT_CORRECTED', 'From date': 'DATE_ABOVE', 'With discrepancies': 'WITH_DISCREPANCY', All: 'ALL'};
const fleet = {Active: 'ACTIVE', Archived: 'ARCHIVED', Brand: 'BRAND', Fuel: 'FUEL', 'To inspect': 'INSPECTABLE', All: 'ALL'};
const inspection = {'From date': 'DATE_ABOVE', Damaged: 'DAMAGED', All: 'ALL'};
const leasing = {Active: 'ACTIVE', All: 'ALL'};
const staff = {All: 'ALL', 'Without car': 'WITHOUT', 'With car': 'WITH', };

@Injectable({
  providedIn: 'root'
})
export class FiltersListsService {

  constructor() { }

  public getFiltersList(whoIsAsking: string) {
    return this.serveLists(whoIsAsking);
  }

  /**
   * Get the list of filters based on a keyword
   * @param whoIsAsking
   * @private
   */
  private serveLists(whoIsAsking: string) {
    switch (whoIsAsking) {
      case 'fillup': return fillup;
      case 'fleet': return fleet;
      case 'inspection': return inspection;
      case 'leasing': return leasing;
      case 'staff': return staff;
      default: return null;
    }
  }
}
