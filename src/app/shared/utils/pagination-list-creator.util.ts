export class PaginationListCreatorUtil {
  private static paginationChoices: number[] = [10, 25, 50, 100, 200];

  public static setPaginationList(array: any[]): number[] {
    this.paginationChoices = this.paginationChoices.filter( n => n < array.length);
    this.paginationChoices.push(array.length);
    return this.paginationChoices;
  }
}
