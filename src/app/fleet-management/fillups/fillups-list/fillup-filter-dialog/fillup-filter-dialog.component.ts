import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSelectChange} from '@angular/material/select';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';

export const DateFormat = {
  parse: {
    dateInput: 'input',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};

@Component({
  selector: 'app-fillup-filter-dialog',
  templateUrl: './fillup-filter-dialog.component.html',
  styleUrls: ['./fillup-filter-dialog.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: DateFormat}
  ]
})
export class FillupFilterDialogComponent implements OnInit {
  public form: FormGroup;
  public filtersList: {key: string, value: string}[] = [];
  public title = 'Filter list';
  public formIsValid = false;
  public maxDate = new Date();

  constructor(
    public matDialogRef: MatDialogRef<FillupFilterDialogComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: {list: object, current: string, option: string}
  ) { }

  ngOnInit() {
    this.initFiltersList();
    this.initForm();
  }

  /**
   * Make a list of key:value filters from the plain JSON object
   */
  private initFiltersList() {
    Object.entries(this.data.list).forEach(
      ([key, value]) => {
        this.filtersList.push({key, value});
      }
    );
  }

  /**
   * Initialize the form
   */
  private initForm() {
    this.form = this.formBuilder.group({
      filter: [this.data.current, Validators.required],
      option: [this.data.option]
    });
  }

  /**
   * Reset selection for 'From date' option if main selection is changed
   * @param $event
   */
  public updateSelection($event: MatSelectChange) {
    this.form.controls.option.setValue(null);
    if ($event.value !== 'DATE_ABOVE') {
      this.formIsValid = true;
    } else {
      this.formIsValid = false;
    }
  }

  /**
   * Pass filter value to parent component
   */
  public doFilter() {
    this.matDialogRef.close(this.form.value);
  }
}
