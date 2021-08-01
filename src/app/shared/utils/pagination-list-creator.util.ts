import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaginationListCreatorUtil {
  private readonly paginationDefaultSizes: number[] = [10, 25, 50, 100, 200];
  private paginationChoices: number[] = [];

  /**
   * Get the list of page numbers to display based on length of the whole list
   * @param maxSize The number of items in the list
   */
  public setPaginationList(maxSize: number): number[] {
    this.paginationChoices = [];
    this.paginationDefaultSizes.forEach( n => {
      if (n + 2 < maxSize) {
        this.paginationChoices.push(n);
      }
    });
    this.paginationChoices.push(maxSize);
    return this.paginationChoices;
  }
}
