import {Directive, HostListener} from '@angular/core';
import {NgControl} from "@angular/forms";

@Directive({
  selector: '[appPositiveNumbers]'
})
export class PositiveNumbersDirective {

  constructor(public ngControl: NgControl) {
  }

  @HostListener('ngModelChange', ['$event'])
  onModelChange(event) {
    this.onInputChange(event);
  }

  onInputChange(event) {
    let newVal = '' + event;
    newVal = newVal.replace('-', '');
    this.ngControl.valueAccessor.writeValue(newVal);
  }
}
