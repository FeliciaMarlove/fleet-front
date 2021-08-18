import {Directive, HostListener} from '@angular/core';
import {NgControl} from '@angular/forms';

@Directive({
  selector: '[appPhoneMask]'
})
export class PhoneMaskDirective {
  constructor(public ngControl: NgControl) {
  }

  @HostListener('ngModelChange', ['$event'])
  onModelChange(event) {
    this.onInputChange(event, true);
  }

  /**
   * On clicking
   * @param event
   */
  @HostListener('click', ['$event'])
  click(event) {
    this.onInputChange(event.target.value, false);
  }

  /**
   * On pressing backspace
   * @param event
   */
  @HostListener('keydown.backspace', ['$event'])
  keydownBackspace(event) {
    this.onInputChange(event.target.value, true);
  }

  /**
   * On pressing tabulation, entering the field
   * @param event
   */
  @HostListener('keyup.tab', ['$event'])
  tabIn(event) {
    this.onInputChange(event.target.value, false);
  }

  /**
   * On pressing tabulation, leaving the field
   * @param event
   */
  @HostListener('keydown.tab', ['$event'])
  tabOut(event) {
    // if field contains just "0", field was entered but not filled in, we clean it
    if (event.target.value === '0') {
      this.onInputChange('', true);
    }
  }

  /**
   * Format content according to input
   * Clean field when appropriate
   * @param event
   * @param backspace
   */
  onInputChange(event, backspace) {
    let newVal = event.replace(/\D/g, '');
    if (newVal.length === 0) {
      if (backspace) {
        newVal = '';
      } else {
        newVal = '0';
      }
    } else if (newVal.length <= 3) {
      newVal = newVal.replace(/^(\w{0,3})/, '$1');
    } else if (newVal.length <= 6) {
      newVal = newVal.replace(/^(\w{0,3})(\w{0,2})/, '$1 $2');
    } else if (newVal.length <= 9) {
      newVal = newVal.replace(/^(\w{0,3})(\w{0,2})(\w{0,2})(\w{0,2})/, '$1 $2 $3 $4').trim();
    } else if (newVal.length === 10) {
      newVal = newVal.replace(/^(\w{0,4})(\w{0,2})(\w{0,2})(\w{0,2})/, '$1 $2 $3 $4');
    } else if (newVal.length > 10) {
      newVal = newVal.substr(0, 10);
      newVal = newVal.replace(/^(\w{0,4})(\w{0,2})(\w{0,2})(\w{0,2})/, '$1 $2 $3 $4');
    }
    this.ngControl.valueAccessor.writeValue(newVal);
  }

}
