import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Brand} from '../../../../shared/enums/brand.enum';
import {FuelType} from '../../../../shared/enums/fuel-type.enum';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSelectChange} from '@angular/material/select';

@Component({
  selector: 'app-fleet-filter-dialog',
  templateUrl: './fleet-filter-dialog.component.html',
  styleUrls: ['./fleet-filter-dialog.component.scss']
})
export class FleetFilterDialogComponent implements OnInit {
  public form: FormGroup;
  public filtersList: {key: string, value: string}[] = [];
  public brandEnum = Brand;
  public fuelEnum = FuelType;
  public title = 'Filter list';
  public formIsValid = false;

  constructor(
    public matDialogRef: MatDialogRef<FleetFilterDialogComponent>,
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
   * Reset selection for brand or fueltype option if main selection is changed
   * @param $event The value of the select box
   */
  public updateSelection($event: MatSelectChange) {
    this.form.controls.option.setValue(null);
    this.formIsValid = $event.value !== 'BRAND' && $event.value !== 'FUEL';
  }

  /**
   * Close dialog and pass filter to parent
   */
  public doFilter() {
    this.matDialogRef.close(this.form.value);
  }
}
