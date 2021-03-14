import { Injectable } from '@angular/core';

const fillup = {'TO DO': 'WITH_DISCREPANCY_NOT_CORRECTED', 'From date': 'DATE_ABOVE', 'With discrepancies': 'WITH_DISCREPANCY', All: 'ALL'};

@Injectable({
  providedIn: 'root'
})
export class FiltersListsService {

  constructor() { }

  public getFiltersList(whoIsAsking: string) {
    return this.serveLists(whoIsAsking);
  }

  private serveLists(whoIsAsking: string) {
    switch (whoIsAsking) {
      case 'fillup': return fillup;
    }
  }
}
