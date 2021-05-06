import {Directive, HostListener} from '@angular/core';
import {NgControl} from '@angular/forms';

@Directive({
  selector: '[appPlateNumber]'
})
export class PlateNumberDirective {

  constructor(public ngControl: NgControl) { }

  @HostListener('ngModelChange', ['$event'])
  onModelChange(event) {
    this.onInputChange(event, false);
  }

  @HostListener('click', ['$event'])
  click(event) {
    this.onInputChange(event.target.value, true);
  }

  @HostListener('keydown.backspace', ['$event'])
  keydownBackspace(event) {
    this.onInputChange(event.target.value, true);
  }

  onInputChange(event, backspace) {
    let newVal = event.replace(/\W/g, '');
    if (backspace && newVal.length === 1) {
      newVal = '';
    } else if (newVal.length === 1) {
      newVal = newVal.replace(/^(\w{0,1})/, '$1-');
    } else if (newVal.length <= 4) {
      newVal = newVal.replace(/^(\w{0,1})(\w{0,3})/, '$1-$2').toUpperCase();
    } else if (newVal.length <= 7) {
      newVal = newVal.replace(/^(\w{0,1})(\w{0,3})(\w{0,3})/, '$1-$2-$3').toUpperCase();
    } else {
      newVal = newVal.substr(0, 7);
      newVal = newVal.replace(/^(\w{0,1})(\w{0,3})(\w{0,3})/, '$1-$2-$3').toUpperCase();
    }
    this.ngControl.valueAccessor.writeValue(newVal);
  }

}
