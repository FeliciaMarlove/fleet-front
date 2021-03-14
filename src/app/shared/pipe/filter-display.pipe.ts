import { Pipe, PipeTransform } from '@angular/core';
import {FuelType} from '../enums/fuel-type.enum';
import {FiltersListsService} from '../utils/filters-lists.service';
import {Brand} from '../enums/brand.enum';

@Pipe({
  name: 'filterDisplay'
})
export class FilterDisplayPipe implements PipeTransform {

  constructor(private filtersListsService: FiltersListsService) {
  }

  /**
   * Transform a filter into a displayable string
   * @param value The filter "raw name", that is the value of the filter
   * @param option Optional filter
   * @param filterCategory The name of the filter list to get from FiltersListsService
   */
  transform(value: any, option: any, filterCategory: string): string {
    let output = '\n';
    output += this.getFilterCleanName(filterCategory, value);
    if (option) {
      output += '\n' + this.getOptionCleanDisplay(option);
    }
    console.log(output);
    return output;
  }

  /**
   * Return clean output for the option
   * @param option The raw option string
   */
  private getOptionCleanDisplay(option: any): string {
    if (!(new Date(option).toString() === 'Invalid Date')) {
      return new Date(option).toDateString();
    } else {
      const fuelRes = Object.entries(FuelType).find(entry => entry[1] === option)[0];
      const brandRes = Object.entries(Brand).find(entry => entry[1] === option)[0];
      return fuelRes ? fuelRes : brandRes ? brandRes : option;
    }
  }

  /**
   * Return clean name for the Filter
   * @param filterCategory The name of the component as defined in "iAm" constant
   * @param filterRawName The raw name of the filter
   */
  private getFilterCleanName(filterCategory: string, filterRawName: string): string {
    const list = this.filtersListsService.getFiltersList(filterCategory);
    /*
    searches the list of filters for the same "raw" name (value of object),
    gets an array of string as [key, value],
    gets the "clean name" of the filter (key) with index 0
     */
    return Object.entries(list).find(filter => filterRawName === filter[1])[0];
  }

}
