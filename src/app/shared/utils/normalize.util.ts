export class Normalize {
  /**
   * Set string to locale lower case and normalize accented characters
   * @param val The value to normalize
   * @return the normalized value
   */
  public static normalize(val: string) {
    return val ? val.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') : null;
  }
}
