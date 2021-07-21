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

  @HostListener('click', ['$event'])
  click(event) {
    this.onInputChange(event.target.value, false);
  }

  @HostListener('keydown.backspace', ['$event'])
  keydownBackspace(event) {
    this.onInputChange(event.target.value, true);
  }

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
